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

// USD to IDR exchange rate (mid-market, approximate)
// Source: exchangerate-api, 2026-09-10
export const USD_IDR = 17505;
export const kursCheckedAt = '2026-09-10';

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
      "Extended limits on Agent",
      "Generous limits for Grok",
      "Access to frontier models (GPT, Claude, Gemini)",
      "Grok Bot access",
      "MCPs, skills, and hooks",
      "Cloud agents",
      "Bugbot on usage-based billing"
    ],
    caveats: [
      "Pro ($20/mo) adalah baseline, Pro+ ($60/mo) dan Ultra ($200/mo) juga tersedia",
      "Usage pool: Cursor Models (Grok, Composer) + Other Models (third-party)",
      "On-demand usage dikenakan biaya tambahan saat melebihi included pool",
      "Band $20-60 mencerminkan Pro ke Pro+ range untuk regular usage"
    ],
    sources: [
      {
        label: "Cursor Pricing",
        url: "https://cursor.com/pricing",
        checkedAt: "2026-09-10"
      },
      {
        label: "Cursor Models & Pricing Docs",
        url: "https://cursor.com/docs/models-and-pricing",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  },
  {
    id: "github-copilot-pro",
    name: "GitHub Copilot Pro",
    vendor: "GitHub",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 10,
    bandLowUsd: 10,
    bandHighUsd: 39,
    includes: [
      "1,500 AI credits per bulan (1 credit = $0.01 USD)",
      "Code completions unlimited",
      "Chat di IDE, CLI, GitHub.com",
      "Model GPT-4o, Claude Sonnet, o1, o1-mini",
      "Copilot Code Review"
    ],
    caveats: [
      "Harga dasar $10/bulan, Pro+ $39/mo, Max $100/mo juga tersedia",
      "AI Credits digunakan untuk chat, agents, reviews, Spark",
      "Usage di atas included credits dikenakan biaya additional ($0.01/credit)",
      "Band $10-39 mencerminkan Pro ke Pro+ untuk moderate usage"
    ],
    sources: [
      {
        label: "GitHub Copilot Plans",
        url: "https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot",
        checkedAt: "2026-09-10"
      },
      {
        label: "Usage-based billing for individuals",
        url: "https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-individuals",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  },
  {
    id: "github-copilot-business",
    name: "GitHub Copilot Business",
    vendor: "GitHub",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 19,
    bandLowUsd: 19,
    bandHighUsd: 39,
    includes: [
      "1,900 AI credits per seat per bulan",
      "Pooled credits untuk organization",
      "Semua fitur Individual Pro",
      "Policy management",
      "Organization-wide settings",
      "IP indemnity"
    ],
    caveats: [
      "Minimum 1 seat di $19/seat/bulan",
      "Credits di-pool di level organization, bukan per-user",
      "Enterprise ($39/seat) menyediakan 3,900 credits per seat",
      "Additional usage di atas pool dikenakan $0.01 per credit"
    ],
    sources: [
      {
        label: "GitHub Copilot Plans",
        url: "https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot",
        checkedAt: "2026-09-10"
      },
      {
        label: "Usage-based billing for organizations",
        url: "https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  },
  {
    id: "devin-desktop-pro",
    name: "Devin Desktop Pro",
    vendor: "Cognition (Windsurf)",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 20,
    bandLowUsd: 20,
    bandHighUsd: 50,
    includes: [
      "Increased daily and weekly quotas",
      "Full model access (OpenAI, Claude, Gemini)",
      "Free SWE 1.7 dan open source models",
      "Devin Cloud agents included",
      "Unlimited Tab completions",
      "Extra usage at API pricing"
    ],
    caveats: [
      "Windsurf acquired oleh Cognition (Juli 2025), rebranded ke Devin Desktop (Juni 2026)",
      "Pricing unchanged: Free $0, Pro $20, Max $200, Teams $80+$40/seat",
      "Quota tidak dipublikasikan dalam angka eksplisit",
      "Heavy usage dapat memicu on-demand billing di atas sticker"
    ],
    sources: [
      {
        label: "Devin Pricing",
        url: "https://devin.ai/pricing",
        checkedAt: "2026-09-10"
      },
      {
        label: "Cognition Windsurf Acquisition",
        url: "https://cognition.com/blog/windsurf",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  },
  {
    id: "claude-code-cli",
    name: "Claude Code CLI",
    vendor: "Anthropic",
    category: "cli",
    billing: "hybrid",
    stickerUsd: 20,
    bandLowUsd: 20,
    bandHighUsd: 100,
    includes: [
      "Included dalam Claude Pro subscription ($20/mo)",
      "Juga tersedia via Claude Max (5x atau 20x usage)",
      "Terminal integration",
      "File editing capabilities",
      "Opsi API key untuk pay-per-token"
    ],
    caveats: [
      "BUKAN pure API - included dalam Claude Pro/Max seat",
      "Usage shared dengan web/desktop Claude (one pool)",
      "Bisa juga pakai ANTHROPIC_API_KEY untuk API billing langsung",
      "Paid usage credits tersedia setelah included limits (billed at API rates)",
      "Band $20-100 mencerminkan Pro subscription hingga heavy API usage"
    ],
    sources: [
      {
        label: "Claude Pricing",
        url: "https://claude.com/pricing",
        checkedAt: "2026-09-10"
      },
      {
        label: "Claude Code Authentication Docs",
        url: "https://code.claude.com/docs/en/authentication",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  },
  {
    id: "aider",
    name: "Aider",
    vendor: "Aider (Open Source)",
    category: "oss-byok",
    billing: "token",
    stickerUsd: 0,
    bandLowUsd: 5,
    bandHighUsd: 80,
    includes: [
      "Open source (MIT license) - GRATIS untuk software",
      "Git-aware AI coding",
      "Pair programming di terminal",
      "Mendukung 20+ providers (OpenAI, Anthropic, Google, DeepSeek, Ollama)",
      "BYOK (Bring Your Own Key) - no subscription"
    ],
    caveats: [
      "BUKAN plan Aider - Aider tidak punya subscription atau coding plan",
      "Biaya = API provider yang Anda pilih (OpenAI/Anthropic/dll)",
      "Aider sendiri $0 selamanya, bayar token API saja",
      "Estimasi $5-80/bulan tergantung model & usage intensity",
      "Bisa $0 jika pakai local model (Ollama/vLLM)"
    ],
    sources: [
      {
        label: "Aider Website",
        url: "https://aider.chat/",
        checkedAt: "2026-09-10"
      },
      {
        label: "Aider GitHub",
        url: "https://github.com/paul-gauthier/aider",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  },
  {
    id: "continue",
    name: "Continue (Discontinued)",
    vendor: "Continue → Cursor",
    category: "oss-byok",
    billing: "token",
    stickerUsd: 0,
    bandLowUsd: 0,
    bandHighUsd: 0,
    includes: [
      "Acquired oleh Cursor (Juni 2026), product discontinued",
      "Codebase tetap tersedia (Apache 2.0, read-only)",
      "Repository tidak lagi maintained",
      "Final release: v2.0.0 (telemetry removed)"
    ],
    caveats: [
      "PRODUCT TIDAK LAGI TERSEDIA untuk adopsi baru",
      "Cloud data deleted setelah July 15, 2026",
      "Community dapat fork codebase, tapi tanpa dukungan resmi",
      "Alternatif: Cline (untuk JetBrains), Cursor, atau tools BYOK lain",
      "Band $0-0 karena tidak ada pricing - product sudah shutdown"
    ],
    sources: [
      {
        label: "Continue GitHub (read-only)",
        url: "https://github.com/continuedev/continue",
        checkedAt: "2026-09-10"
      },
      {
        label: "Cursor acquires Continue (TechCrunch)",
        url: "https://thenewstack.io/cursor-acquires-continue-coding/",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  },
  {
    id: "devin-cloud-pro",
    name: "Devin Cloud Pro",
    vendor: "Cognition AI",
    category: "cloud",
    billing: "hybrid",
    stickerUsd: 20,
    bandLowUsd: 20,
    bandHighUsd: 200,
    includes: [
      "Autonomous AI software engineer",
      "Cloud workspace dengan VM dedicated",
      "Plan, code, test, deploy autonomously",
      "Daily and weekly usage quota",
      "Slack & Linear integration",
      "On-demand credits untuk extra usage"
    ],
    caveats: [
      "Pro $20/mo adalah baseline; Max $200/mo untuk power users",
      "Teams: $80/mo + $40/full seat (unlimited members)",
      "Quota tidak dipublikasikan dalam angka numerik eksplisit",
      "Usage di atas quota: on-demand credits at API pricing",
      "Band $20-200 mencerminkan Pro hingga Max tier untuk autonomous usage"
    ],
    sources: [
      {
        label: "Devin Pricing",
        url: "https://devin.ai/pricing",
        checkedAt: "2026-09-10"
      },
      {
        label: "Cognition New Self-Serve Plans",
        url: "https://cognition.com/blog/new-self-serve-plans-for-devin",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  },
  {
    id: "cursor-business",
    name: "Cursor Teams Standard",
    vendor: "Cursor",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 40,
    bandLowUsd: 40,
    bandHighUsd: 100,
    includes: [
      "Everything in Individual Pro",
      "Centralized team billing and administration",
      "Team marketplace for internal rules, skills, plugins",
      "Cloud agents with shared team context",
      "Grok Bot access",
      "Agentic code reviews with Bugbot",
      "Usage analytics",
      "Team-wide privacy mode",
      "SAML/OIDC SSO"
    ],
    caveats: [
      "Teams Standard $40/user/mo baseline",
      "Per-seat usage allowance (tidak di-pool seperti Enterprise)",
      "Cursor Token Rate $0.25 per million tokens on third-party models (tidak di Individual)",
      "Band tinggi untuk power users yang melebihi included allowance"
    ],
    sources: [
      {
        label: "Cursor Pricing",
        url: "https://cursor.com/pricing",
        checkedAt: "2026-09-10"
      },
      {
        label: "Cursor Forum: Teams vs Individual",
        url: "https://forum.cursor.com/t/usage-limits-in-teams-vs-individual/167937",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10"
  }
];
