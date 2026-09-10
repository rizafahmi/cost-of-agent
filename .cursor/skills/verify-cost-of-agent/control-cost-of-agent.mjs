#!/usr/bin/env node

/**
 * Control CLI for Cost-of-Agent Astro static site verification
 * Zero dependencies - Node built-ins only
 * 
 * Usage:
 *   node control-cost-of-agent.mjs <command> [args]
 */

import { spawn, execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment configuration
const COA_BASE_URL = process.env.COA_BASE_URL || 'http://127.0.0.1:4323';
const COA_HOST = process.env.COA_HOST || '127.0.0.1';
const COA_PORT = process.env.COA_PORT || '4323';

// State management
const CONTROL_DIR = join(__dirname, 'evidence', '.control');
const STATE_FILE = join(CONTROL_DIR, 'preview.json');

// Find workspace root by climbing to package.json
function findWorkspaceRoot() {
  let current = __dirname;
  while (current !== '/') {
    if (existsSync(join(current, 'package.json'))) {
      return current;
    }
    current = dirname(current);
  }
  throw new Error('Could not find workspace root (no package.json found)');
}

const WORKSPACE_ROOT = findWorkspaceRoot();
const DIST_DIR = join(WORKSPACE_ROOT, 'dist');

// ============================================================================
// State Management
// ============================================================================

function ensureControlDir() {
  if (!existsSync(CONTROL_DIR)) {
    mkdirSync(CONTROL_DIR, { recursive: true });
  }
}

function saveState(state) {
  ensureControlDir();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function loadState() {
  if (!existsSync(STATE_FILE)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function clearState() {
  if (existsSync(STATE_FILE)) {
    rmSync(STATE_FILE);
  }
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// HTTP Utilities
// ============================================================================

async function httpGet(url) {
  const urlObj = new URL(url);
  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port,
    path: urlObj.pathname + urlObj.search,
    method: 'GET',
    timeout: 5000,
  };

  const protocol = urlObj.protocol === 'https:' ? 
    await import('node:https') : 
    await import('node:http');

  return new Promise((resolve, reject) => {
    const req = protocol.default.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function waitForServer(url, maxAttempts = 30, delayMs = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await httpGet(url);
      if (res.statusCode === 200) {
        return true;
      }
    } catch {
      // Ignore errors, keep trying
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return false;
}

// ============================================================================
// Commands
// ============================================================================

async function cmdDoctor() {
  console.log('Running diagnostics...\n');
  
  let allPassed = true;
  
  // 1. Check dist artifacts
  console.log('[1/4] Checking build artifacts...');
  const checks = [
    { path: join(DIST_DIR, 'index.html'), label: 'Home page built' },
    { path: join(DIST_DIR, 'agen'), label: 'Agent detail directory exists' },
  ];
  
  for (const check of checks) {
    if (existsSync(check.path)) {
      console.log(`  ✓ ${check.label}`);
    } else {
      console.log(`  ✗ FAIL: ${check.label}`);
      allPassed = false;
    }
  }
  
  // Count agent directories
  try {
    const agenDirs = execSync(`ls -1 "${join(DIST_DIR, 'agen')}" 2>/dev/null | wc -l`, { encoding: 'utf8' }).trim();
    const count = parseInt(agenDirs);
    if (count === 12) {
      console.log(`  ✓ Agent directories count: ${count}`);
    } else {
      console.log(`  ✗ FAIL: Expected 12 agent directories, found ${count}`);
      allPassed = false;
    }
  } catch {
    console.log('  ✗ FAIL: Could not count agent directories');
    allPassed = false;
  }
  
  // 2. Check server responds
  console.log('\n[2/4] Checking server response...');
  try {
    const homeRes = await httpGet(`${COA_BASE_URL}/`);
    if (homeRes.statusCode === 200) {
      console.log('  ✓ Home page serves (200)');
    } else {
      console.log(`  ✗ FAIL: Home page returned ${homeRes.statusCode}`);
      allPassed = false;
    }
  } catch (err) {
    console.log(`  ✗ FAIL: Server not responding - ${err.message}`);
    allPassed = false;
  }
  
  try {
    const detailRes = await httpGet(`${COA_BASE_URL}/agen/cursor-pro/`);
    if (detailRes.statusCode === 200) {
      console.log('  ✓ Detail page serves (200)');
    } else {
      console.log(`  ✗ FAIL: Detail page returned ${detailRes.statusCode}`);
      allPassed = false;
    }
  } catch (err) {
    console.log(`  ✗ FAIL: Detail page not responding - ${err.message}`);
    allPassed = false;
  }
  
  // 3. Check key content
  console.log('\n[3/4] Checking key content...');
  try {
    const homeRes = await httpGet(`${COA_BASE_URL}/`);
    const homeHtml = homeRes.body;
    
    const contentChecks = [
      { pattern: /Cost of Agent/i, label: 'Home title' },
      { pattern: /agent-card/i, label: 'Agent cards rendered' },
    ];
    
    for (const check of contentChecks) {
      if (check.pattern.test(homeHtml)) {
        console.log(`  ✓ ${check.label} found`);
      } else {
        console.log(`  ✗ FAIL: ${check.label} not found`);
        allPassed = false;
      }
    }
  } catch (err) {
    console.log(`  ✗ FAIL: Could not fetch home page for content check - ${err.message}`);
    allPassed = false;
  }
  
  try {
    const detailRes = await httpGet(`${COA_BASE_URL}/agen/cursor-pro/`);
    const detailHtml = detailRes.body;
    
    const detailChecks = [
      { pattern: /Cursor Pro/i, label: 'Detail title' },
      { pattern: /Sumber Data/i, label: 'Sources section (Bahasa)' },
    ];
    
    for (const check of detailChecks) {
      if (check.pattern.test(detailHtml)) {
        console.log(`  ✓ ${check.label} found`);
      } else {
        console.log(`  ✗ FAIL: ${check.label} not found`);
        allPassed = false;
      }
    }
  } catch (err) {
    console.log(`  ✗ FAIL: Could not fetch detail page for content check - ${err.message}`);
    allPassed = false;
  }
  
  // 4. Route count
  console.log('\n[4/4] Checking route count...');
  try {
    const indexFiles = execSync(
      `find "${DIST_DIR}" -name "index.html" 2>/dev/null | wc -l`,
      { encoding: 'utf8' }
    ).trim();
    const count = parseInt(indexFiles);
    if (count === 10) {
      console.log(`  ✓ Route count: ${count} (1 home + 9 agents)`);
    } else {
      console.log(`  ✗ FAIL: Expected 10 routes, found ${count}`);
      allPassed = false;
    }
  } catch (err) {
    console.log(`  ✗ FAIL: Could not count routes - ${err.message}`);
    allPassed = false;
  }
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✓ All checks passed');
    process.exit(0);
  } else {
    console.log('✗ Some checks failed');
    process.exit(1);
  }
}

function cmdBuild() {
  console.log('Building site...');
  try {
    execSync('pnpm build', {
      cwd: WORKSPACE_ROOT,
      stdio: 'inherit',
    });
    console.log('✓ Build completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('✗ Build failed');
    process.exit(err.status || 1);
  }
}

async function cmdPreview() {
  console.log('Starting preview server...');
  
  // Check if already running
  const state = loadState();
  if (state && state.pid && isProcessRunning(state.pid)) {
    // Try to verify it's actually responding
    try {
      const res = await httpGet(`http://${state.host}:${state.port}/`);
      if (res.statusCode === 200) {
        console.log(`✓ Preview already running (PID ${state.pid}, port ${state.port})`);
        console.log(`  URL: http://${state.host}:${state.port}/`);
        process.exit(0);
      }
    } catch {
      // Process exists but not responding, might be starting up
      const age = Date.now() - new Date(state.startedAt).getTime();
      if (age < 5000) {
        // Give it time to start (less than 5s old)
        console.log(`✓ Preview starting (PID ${state.pid}, port ${state.port})`);
        console.log(`  URL: http://${state.host}:${state.port}/`);
        console.log('  (Use "wait-ready" to confirm server is responding)');
        process.exit(0);
      }
    }
  }
  
  // Clear stale state
  if (state && state.pid) {
    console.log(`  Clearing stale PID ${state.pid}`);
    clearState();
  }
  
  // Check if dist exists
  if (!existsSync(DIST_DIR)) {
    console.error('✗ dist/ directory not found. Run build first.');
    process.exit(1);
  }
  
  // Start preview server
  const args = ['preview', '--host', COA_HOST, '--port', COA_PORT];
  const child = spawn('pnpm', args, {
    cwd: WORKSPACE_ROOT,
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  
  child.unref();
  
  // Give it a moment to start
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newState = {
    pid: child.pid,
    port: parseInt(COA_PORT),
    host: COA_HOST,
    startedAt: new Date().toISOString(),
  };
  
  saveState(newState);
  
  console.log(`✓ Preview server started`);
  console.log(`  PID: ${child.pid}`);
  console.log(`  URL: http://${COA_HOST}:${COA_PORT}/`);
  console.log('  (Use "wait-ready" to confirm server is responding)');
  process.exit(0);
}

function cmdStop() {
  console.log('Stopping preview server...');
  
  const state = loadState();
  if (!state || !state.pid) {
    console.log('  No preview server state found');
    process.exit(0);
  }
  
  if (!isProcessRunning(state.pid)) {
    console.log(`  PID ${state.pid} is not running`);
    clearState();
    process.exit(0);
  }
  
  try {
    process.kill(state.pid, 'SIGTERM');
    console.log(`✓ Sent SIGTERM to PID ${state.pid}`);
    
    // Wait a bit for graceful shutdown
    setTimeout(() => {
      if (isProcessRunning(state.pid)) {
        console.log('  Process still running, sending SIGKILL...');
        try {
          process.kill(state.pid, 'SIGKILL');
        } catch {}
      }
      clearState();
      console.log('✓ Preview server stopped');
    }, 2000);
  } catch (err) {
    console.error(`✗ Failed to stop process: ${err.message}`);
    clearState();
    process.exit(1);
  }
}

async function cmdWaitReady() {
  console.log(`Waiting for server at ${COA_BASE_URL}...`);
  
  const ready = await waitForServer(`${COA_BASE_URL}/`, 30, 1000);
  if (ready) {
    console.log('✓ Server is ready');
    process.exit(0);
  } else {
    console.error('✗ Server did not become ready within timeout');
    process.exit(1);
  }
}

async function cmdGet(path) {
  if (!path) {
    console.error('Usage: get <path>');
    console.error('Example: get /');
    console.error('Example: get /agen/cursor-pro/');
    process.exit(1);
  }
  
  const url = `${COA_BASE_URL}${path}`;
  console.log(`GET ${url}\n`);
  
  try {
    const res = await httpGet(url);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Length: ${res.body.length}\n`);
    console.log(res.body);
    process.exit(res.statusCode === 200 ? 0 : 1);
  } catch (err) {
    console.error(`✗ Request failed: ${err.message}`);
    process.exit(1);
  }
}

async function cmdOrder() {
  console.log('Extracting agent order from home page...\n');
  
  try {
    const res = await httpGet(`${COA_BASE_URL}/`);
    const html = res.body;
    
    // Extract agent IDs from href="/agen/{id}/" links
    const regex = /href="\/agen\/([^/]+)\/"/g;
    const ids = [];
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      ids.push(match[1]);
    }
    
    if (ids.length === 0) {
      console.error('✗ No agent links found');
      process.exit(1);
    }
    
    // Output one per line
    ids.forEach(id => console.log(id));
    
    console.error(`\n(Found ${ids.length} agents)`);
    process.exit(0);
  } catch (err) {
    console.error(`✗ Failed to fetch home page: ${err.message}`);
    process.exit(1);
  }
}

async function cmdCheckHome() {
  console.log('Checking home page...\n');
  
  try {
    const res = await httpGet(`${COA_BASE_URL}/`);
    const html = res.body;
    
    // Extract agent IDs
    const regex = /href="\/agen\/([^/]+)\/"/g;
    const ids = [];
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      ids.push(match[1]);
    }
    
    let allPassed = true;
    
    // Check count
    if (ids.length >= 10 && ids.length <= 15) {
      console.log(`✓ Agent count: ${ids.length} (reasonable range)`);
    } else {
      console.log(`✗ FAIL: Expected ~12 agents, found ${ids.length}`);
      allPassed = false;
    }
    
    // Check first is continue (lowest bandLowUsd: 0)
    if (ids[0] === 'continue') {
      console.log(`✓ First agent: continue (lowest cost)`);
    } else {
      console.log(`✗ FAIL: First agent is "${ids[0]}", expected "continue"`);
      allPassed = false;
    }
    
    // Check last is devin (highest bandLowUsd: 500)
    if (ids[ids.length - 1] === 'devin') {
      console.log(`✓ Last agent: devin (highest cost)`);
    } else {
      console.log(`✗ FAIL: Last agent is "${ids[ids.length - 1]}", expected "devin"`);
      allPassed = false;
    }
    
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log('✓ Home page checks passed');
      process.exit(0);
    } else {
      console.log('✗ Home page checks failed');
      process.exit(1);
    }
  } catch (err) {
    console.error(`✗ Failed to check home page: ${err.message}`);
    process.exit(1);
  }
}

async function cmdCheckDetail(agentId) {
  if (!agentId) {
    console.error('Usage: check-detail <agent-id>');
    console.error('Example: check-detail cursor-pro');
    process.exit(1);
  }
  
  console.log(`Checking detail page for "${agentId}"...\n`);
  
  try {
    const res = await httpGet(`${COA_BASE_URL}/agen/${agentId}/`);
    const html = res.body;
    
    let allPassed = true;
    
    // Check for key sections (Bahasa headings)
    const checks = [
      { pattern: /<h1[^>]*>/, label: 'Agent name heading (h1)' },
      { pattern: /Yang Termasuk/i, label: 'Includes section (Yang Termasuk)' },
      { pattern: /Catatan Penting/i, label: 'Caveats section (Catatan Penting)' },
      { pattern: /Sumber Data/i, label: 'Sources section (Sumber Data)' },
    ];
    
    for (const check of checks) {
      if (check.pattern.test(html)) {
        console.log(`✓ ${check.label}`);
      } else {
        console.log(`✗ FAIL: ${check.label} not found`);
        allPassed = false;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log(`✓ Detail page checks passed for "${agentId}"`);
      process.exit(0);
    } else {
      console.log(`✗ Detail page checks failed for "${agentId}"`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`✗ Failed to check detail page: ${err.message}`);
    process.exit(1);
  }
}

async function cmdSnapshot(path) {
  if (!path) {
    console.error('Usage: snapshot <path>');
    console.error('Example: snapshot /');
    console.error('Example: snapshot /agen/cursor-pro/');
    process.exit(1);
  }
  
  const url = `${COA_BASE_URL}${path}`;
  
  try {
    const res = await httpGet(url);
    const html = res.body;
    
    const snapshot = {
      url,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
      structure: {},
    };
    
    // Extract structural info
    if (path === '/' || path === '') {
      // Home page
      const regex = /href="\/agen\/([^/]+)\/"/g;
      const ids = [];
      let match;
      while ((match = regex.exec(html)) !== null) {
        ids.push(match[1]);
      }
      
      snapshot.structure = {
        type: 'home',
        agentCardCount: ids.length,
        agentIds: ids,
        hasTitle: /Cost of Agent/i.test(html),
        hasBahasaCopy: /Direktori/i.test(html),
      };
    } else if (path.startsWith('/agen/')) {
      // Detail page
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
      const agentName = h1Match ? h1Match[1].trim() : null;
      
      snapshot.structure = {
        type: 'detail',
        agentName,
        hasIncludes: /Yang Termasuk/i.test(html),
        hasCaveats: /Catatan Penting/i.test(html),
        hasSources: /Sumber Data/i.test(html),
      };
    }
    
    console.log(JSON.stringify(snapshot, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(`✗ Failed to snapshot: ${err.message}`);
    process.exit(1);
  }
}

function cmdEvidenceInit() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const runDir = join(__dirname, 'evidence', `run-${timestamp}`);
  
  console.log('Initializing evidence directory...');
  mkdirSync(runDir, { recursive: true });
  
  console.log(`✓ Created: ${runDir}`);
  
  // Write a README
  const readme = `# Evidence Run: ${timestamp}

Generated by control-cost-of-agent.mjs

## Files in this directory

- agent-order.txt — Agent IDs in home page display order
- doctor-output.txt — Output of doctor command
- check-home-output.txt — Output of check-home command
- check-detail-*.txt — Output of check-detail for each agent

## Rerun

\`\`\`bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs smoke
\`\`\`
`;
  
  writeFileSync(join(runDir, 'README.md'), readme);
  
  // Output path for scripting
  console.log(runDir);
  process.exit(0);
}

async function cmdSmoke() {
  console.log('Running smoke test...\n');
  console.log('='.repeat(60));
  
  let exitCode = 0;
  
  // 1. Build (if needed)
  console.log('\n[1/8] Build check...');
  if (!existsSync(DIST_DIR)) {
    console.log('  dist/ not found, running build...');
    try {
      execSync('pnpm build', { cwd: WORKSPACE_ROOT, stdio: 'inherit' });
      console.log('  ✓ Build completed');
    } catch {
      console.error('  ✗ Build failed');
      process.exit(1);
    }
  } else {
    console.log('  ✓ dist/ exists, skipping build');
  }
  
  // 2. Start preview (inline to avoid process.exit)
  console.log('\n[2/8] Starting preview...');
  const state = loadState();
  if (!state || !state.pid || !isProcessRunning(state.pid)) {
    if (state && state.pid) {
      console.log(`  Clearing stale PID ${state.pid}`);
      clearState();
    }
    
    const args = ['preview', '--host', COA_HOST, '--port', COA_PORT];
    const child = spawn('pnpm', args, {
      cwd: WORKSPACE_ROOT,
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    
    const newState = {
      pid: child.pid,
      port: parseInt(COA_PORT),
      host: COA_HOST,
      startedAt: new Date().toISOString(),
    };
    saveState(newState);
    console.log(`  ✓ Preview started (PID ${child.pid})`);
  } else {
    console.log(`  ✓ Preview already running (PID ${state.pid})`);
  }
  
  // 3. Wait for ready
  console.log('\n[3/8] Waiting for server...');
  const ready = await waitForServer(`${COA_BASE_URL}/`, 30, 1000);
  if (!ready) {
    console.error('  ✗ Server did not become ready');
    exitCode = 1;
  } else {
    console.log('  ✓ Server ready');
  }
  
  // 4. Doctor (inline checks)
  if (exitCode === 0) {
    console.log('\n[4/8] Running doctor checks...');
    
    // Check artifacts
    const artifactChecks = [
      existsSync(join(DIST_DIR, 'index.html')),
      existsSync(join(DIST_DIR, 'agen')),
    ];
    
    if (artifactChecks.every(Boolean)) {
      console.log('  ✓ Build artifacts present');
    } else {
      console.log('  ✗ Build artifacts missing');
      exitCode = 1;
    }
    
    // Check server
    try {
      const homeRes = await httpGet(`${COA_BASE_URL}/`);
      const detailRes = await httpGet(`${COA_BASE_URL}/agen/cursor-pro/`);
      if (homeRes.statusCode === 200 && detailRes.statusCode === 200) {
        console.log('  ✓ Server responding');
      } else {
        console.log('  ✗ Server errors');
        exitCode = 1;
      }
    } catch {
      console.log('  ✗ Server not responding');
      exitCode = 1;
    }
  }
  
  // 5. Check home
  if (exitCode === 0) {
    console.log('\n[5/8] Checking home page...');
    try {
      const res = await httpGet(`${COA_BASE_URL}/`);
      const html = res.body;
      const regex = /href="\/agen\/([^/]+)\/"/g;
      const ids = [];
      let match;
      while ((match = regex.exec(html)) !== null) {
        ids.push(match[1]);
      }
      
      if (ids.length >= 10 && ids[0] === 'continue' && ids[ids.length - 1] === 'devin') {
        console.log(`  ✓ Home page structure valid (${ids.length} agents, correct order)`);
      } else {
        console.log(`  ✗ Home page structure invalid`);
        exitCode = 1;
      }
    } catch (err) {
      console.log(`  ✗ Home check failed: ${err.message}`);
      exitCode = 1;
    }
  }
  
  // 6. Check detail
  if (exitCode === 0) {
    console.log('\n[6/8] Checking detail page (cursor-pro)...');
    try {
      const res = await httpGet(`${COA_BASE_URL}/agen/cursor-pro/`);
      const html = res.body;
      
      const hasRequiredSections = 
        /<h1[^>]*>/.test(html) &&
        /Yang Termasuk/i.test(html) &&
        /Catatan Penting/i.test(html) &&
        /Sumber Data/i.test(html);
      
      if (hasRequiredSections) {
        console.log('  ✓ Detail page structure valid');
      } else {
        console.log('  ✗ Detail page missing sections');
        exitCode = 1;
      }
    } catch (err) {
      console.log(`  ✗ Detail check failed: ${err.message}`);
      exitCode = 1;
    }
  }
  
  // 7. Evidence
  console.log('\n[7/8] Creating evidence...');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const runDir = join(__dirname, 'evidence', `run-${timestamp}`);
  mkdirSync(runDir, { recursive: true });
  
  const summaryLines = [
    '# Smoke Test Evidence',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Exit Code: ${exitCode}`,
    '',
    '## Test Results',
    '',
    exitCode === 0 ? '✓ All checks passed' : '✗ Some checks failed',
  ];
  
  writeFileSync(join(runDir, 'smoke-summary.txt'), summaryLines.join('\n'));
  console.log(`  ✓ Evidence: ${runDir}`);
  
  // 8. Stop server
  console.log('\n[8/8] Stopping preview...');
  const stopState = loadState();
  if (stopState && stopState.pid && isProcessRunning(stopState.pid)) {
    try {
      process.kill(stopState.pid, 'SIGTERM');
      console.log(`  ✓ Sent SIGTERM to PID ${stopState.pid}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (isProcessRunning(stopState.pid)) {
        process.kill(stopState.pid, 'SIGKILL');
      }
    } catch (err) {
      console.log(`  ⚠ Stop warning: ${err.message}`);
    }
    clearState();
    console.log('  ✓ Preview stopped');
  } else {
    console.log('  ✓ No preview to stop');
  }
  
  console.log('\n' + '='.repeat(60));
  if (exitCode === 0) {
    console.log('✓ Smoke test PASSED');
  } else {
    console.log('✗ Smoke test FAILED');
  }
  
  process.exit(exitCode);
}

function cmdHelp() {
  console.log(`
Cost-of-Agent Control CLI

Usage:
  node control-cost-of-agent.mjs <command> [args]

Commands:
  doctor                     Run diagnostics (dist artifacts, server, content)
  build                      Build the site with pnpm build
  preview                    Start preview server (127.0.0.1 only)
  stop                       Stop preview server
  wait-ready                 Wait for server to respond
  get <path>                 Fetch and print response body
  order                      Extract agent IDs in home page order
  check-home                 Assert home page structure (count, first, last)
  check-detail <agent-id>    Assert detail page sections present
  snapshot <path>            Dump structural summary as JSON
  evidence-init              Create evidence run directory
  smoke                      Full test: build + preview + checks + evidence + stop

Environment Variables:
  COA_BASE_URL              Base URL (default: http://127.0.0.1:4323)
  COA_PORT                  Port (default: 4323)
  COA_HOST                  Host (default: 127.0.0.1)

Examples:
  node control-cost-of-agent.mjs smoke
  node control-cost-of-agent.mjs preview
  node control-cost-of-agent.mjs doctor
  node control-cost-of-agent.mjs order
  node control-cost-of-agent.mjs check-detail cursor-pro
`);
  process.exit(0);
}

// ============================================================================
// Main
// ============================================================================

const command = process.argv[2];
const args = process.argv.slice(3);

(async () => {
  switch (command) {
    case 'doctor':
      await cmdDoctor();
      break;
    case 'build':
      cmdBuild();
      break;
    case 'preview':
      await cmdPreview();
      break;
    case 'stop':
      cmdStop();
      break;
    case 'wait-ready':
      await cmdWaitReady();
      break;
    case 'get':
      await cmdGet(args[0]);
      break;
    case 'order':
      await cmdOrder();
      break;
    case 'check-home':
      await cmdCheckHome();
      break;
    case 'check-detail':
      await cmdCheckDetail(args[0]);
      break;
    case 'snapshot':
      await cmdSnapshot(args[0]);
      break;
    case 'evidence-init':
      cmdEvidenceInit();
      break;
    case 'smoke':
      await cmdSmoke();
      break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      cmdHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run with --help for usage');
      process.exit(1);
  }
})();
