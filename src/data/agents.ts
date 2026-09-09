export type AgentCost = {
  id: string;
  name: string;
  vendor: string;
  category: "ide" | "cli" | "cloud" | "oss-byok";
  billing: "seat" | "credits" | "token" | "hybrid";
  stickerIdr?: number;
  stickerUsd?: number;
  bandLowUsd: number;
  bandHighUsd: number;
  includes: string[];
  caveats: string[];
  sources: { label: string; url: string; checkedAt: string }[];
  lastVerified: string;
};

export const agents: AgentCost[] = [
  {
    id: "cursor-pro",
    name: "Cursor Pro",
    vendor: "Cursor",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 20,
    bandLowUsd: 20,
    bandHighUsd: 60,
    includes: [
      "500 completions cepat per bulan",
      "Akses Claude Sonnet 3.5",
      "Composer mode",
      "Unlimited slow completions"
    ],
    caveats: [
      "Fast requests terbatas 500/bulan",
      "Overcharge $0.5-1 per 1000 fast requests tambahan",
      "Biaya nyata bergantung pada usage di atas kuota"
    ],
    sources: [
      {
        label: "Cursor Pricing",
        url: "https://cursor.com/pricing",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "github-copilot-individual",
    name: "GitHub Copilot Individual",
    vendor: "GitHub",
    category: "ide",
    billing: "seat",
    stickerUsd: 10,
    bandLowUsd: 10,
    bandHighUsd: 10,
    includes: [
      "Code completions unlimited",
      "Chat di IDE",
      "CLI suggestions",
      "Model GPT-4o, Claude Sonnet 3.5"
    ],
    caveats: [
      "Tidak ada overage - flat seat price",
      "Workspace tidak termasuk di Individual"
    ],
    sources: [
      {
        label: "GitHub Copilot Pricing",
        url: "https://github.com/features/copilot/plans",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "github-copilot-business",
    name: "GitHub Copilot Business",
    vendor: "GitHub",
    category: "ide",
    billing: "seat",
    stickerUsd: 19,
    bandLowUsd: 19,
    bandHighUsd: 19,
    includes: [
      "Semua fitur Individual",
      "Policy management",
      "Organization-wide settings",
      "IP indemnity"
    ],
    caveats: [
      "Minimum 1 seat",
      "Tidak ada overage - flat seat price"
    ],
    sources: [
      {
        label: "GitHub Copilot Pricing",
        url: "https://github.com/features/copilot/plans",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "windsurf-pro",
    name: "Windsurf Pro",
    vendor: "Codeium",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 15,
    bandLowUsd: 15,
    bandHighUsd: 50,
    includes: [
      "Unlimited autocomplete",
      "Chat dengan context awareness",
      "Cascade mode (AI flows)",
      "Model premium (Claude, GPT-4)"
    ],
    caveats: [
      "Estimasi band tinggi berdasarkan heavy usage",
      "Cascade mode konsumsi credit lebih banyak",
      "Detail overage tidak dipublikasikan"
    ],
    sources: [
      {
        label: "Windsurf Pricing",
        url: "https://codeium.com/windsurf",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "claude-code-cli",
    name: "Claude Code CLI",
    vendor: "Anthropic",
    category: "cli",
    billing: "token",
    bandLowUsd: 10,
    bandHighUsd: 100,
    includes: [
      "Akses API Claude",
      "Terminal integration",
      "File editing capabilities",
      "Pay-per-token pricing"
    ],
    caveats: [
      "Memerlukan Anthropic API key",
      "Biaya bervariasi berdasarkan usage token",
      "Tidak ada flat seat - pure consumption",
      "Estimasi $10-100 untuk usage ringan-sedang"
    ],
    sources: [
      {
        label: "Anthropic API Pricing",
        url: "https://www.anthropic.com/api",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "aider",
    name: "Aider",
    vendor: "Aider",
    category: "cli",
    billing: "token",
    bandLowUsd: 5,
    bandHighUsd: 80,
    includes: [
      "Git-aware AI coding",
      "Pair programming di terminal",
      "Mendukung OpenAI, Anthropic, dll",
      "Open source - gratis untuk software"
    ],
    caveats: [
      "Biaya = API provider (OpenAI/Anthropic/dll)",
      "Aider sendiri gratis, bayar token API saja",
      "Estimasi $5-80/bulan untuk usage normal"
    ],
    sources: [
      {
        label: "Aider Docs",
        url: "https://aider.chat/docs/",
        checkedAt: "2026-09-09"
      },
      {
        label: "Aider GitHub",
        url: "https://github.com/paul-gauthier/aider",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "continue",
    name: "Continue",
    vendor: "Continue",
    category: "oss-byok",
    billing: "token",
    bandLowUsd: 0,
    bandHighUsd: 50,
    includes: [
      "VS Code & JetBrains extension",
      "Open source",
      "BYOK (Bring Your Own Key)",
      "Mendukung berbagai LLM providers"
    ],
    caveats: [
      "Gratis untuk software Continue",
      "Biaya = token dari provider yang dipilih",
      "Estimasi $0-50 tergantung model & usage",
      "Bisa $0 jika pakai local model"
    ],
    sources: [
      {
        label: "Continue Docs",
        url: "https://continue.dev/docs",
        checkedAt: "2026-09-09"
      },
      {
        label: "Continue GitHub",
        url: "https://github.com/continuedev/continue",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "devin",
    name: "Devin",
    vendor: "Cognition AI",
    category: "cloud",
    billing: "seat",
    stickerUsd: 500,
    bandLowUsd: 500,
    bandHighUsd: 500,
    includes: [
      "Autonomous AI software engineer",
      "Cloud workspace",
      "Plan, code, test, deploy",
      "Slack integration"
    ],
    caveats: [
      "Harga seat bulanan, tidak ada public overage info",
      "Akses terbatas, waitlist",
      "Pricing bisa berubah (masih early access)"
    ],
    sources: [
      {
        label: "Devin Announcement",
        url: "https://www.cognition-labs.com/blog",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "cursor-business",
    name: "Cursor Business",
    vendor: "Cursor",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 40,
    bandLowUsd: 40,
    bandHighUsd: 100,
    includes: [
      "Semua fitur Pro",
      "Centralized billing",
      "Admin dashboard",
      "Privacy mode",
      "2x kuota fast requests (1000/bulan)"
    ],
    caveats: [
      "Fast requests lebih tinggi dari Pro",
      "Overcharge sama seperti Pro",
      "Band tinggi untuk power users"
    ],
    sources: [
      {
        label: "Cursor Pricing",
        url: "https://cursor.com/pricing",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "codeium-free",
    name: "Codeium Free",
    vendor: "Codeium",
    category: "ide",
    billing: "seat",
    stickerUsd: 0,
    bandLowUsd: 0,
    bandHighUsd: 0,
    includes: [
      "Unlimited autocomplete",
      "Chat terbatas",
      "Mendukung 70+ languages",
      "IDE integrations"
    ],
    caveats: [
      "Gratis untuk individual",
      "Chat capabilities terbatas vs Pro",
      "Model tidak selalu yang terbaru"
    ],
    sources: [
      {
        label: "Codeium Pricing",
        url: "https://codeium.com/pricing",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "cursor-hobby",
    name: "Cursor Hobby (Free)",
    vendor: "Cursor",
    category: "ide",
    billing: "seat",
    stickerUsd: 0,
    bandLowUsd: 0,
    bandHighUsd: 0,
    includes: [
      "2000 completions per bulan",
      "Basic features",
      "Akses terbatas ke premium models"
    ],
    caveats: [
      "Completion limit 2000/bulan",
      "Tidak ada premium model access",
      "Untuk hobby projects"
    ],
    sources: [
      {
        label: "Cursor Pricing",
        url: "https://cursor.com/pricing",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  },
  {
    id: "openai-chatgpt-plus",
    name: "ChatGPT Plus (coding use)",
    vendor: "OpenAI",
    category: "cloud",
    billing: "seat",
    stickerUsd: 20,
    bandLowUsd: 20,
    bandHighUsd: 20,
    includes: [
      "GPT-4 access",
      "Canvas mode untuk coding",
      "Faster response times",
      "Priority access to new features"
    ],
    caveats: [
      "Bukan dedicated coding tool",
      "Tidak ada IDE integration native",
      "Rate limits per 3 jam untuk GPT-4"
    ],
    sources: [
      {
        label: "ChatGPT Pricing",
        url: "https://openai.com/chatgpt/pricing",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09"
  }
];
