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
  assumptions?: string[];
  confidence?: "high" | "medium" | "low";
  effectivePerMTokUsd?: number;
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
    lastVerified: "2026-09-09",
    assumptions: [
      "Usage power user: 2000 fast completions per bulan",
      "Asumsi overage $0.75 per 1000 requests di atas 500 kuota",
      "Hitung dasar $20 + (1500 overage × $0.75/1000) = ~$21-60"
    ],
    confidence: "high",
    effectivePerMTokUsd: 15
  },
  {
    id: "github-copilot-individual",
    name: "GitHub Copilot Individual",
    vendor: "GitHub",
    category: "ide",
    billing: "seat",
    stickerUsd: 10,
    bandLowUsd: 10,
    bandHighUsd: 15,
    includes: [
      "Code completions unlimited",
      "Chat di IDE",
      "CLI suggestions",
      "Model GPT-4o, Claude Sonnet 3.5"
    ],
    caveats: [
      "Harga dasar $10/bulan flat",
      "Fitur agentic (Copilot Workspace, extended context) dapat menambah biaya usage",
      "TCO bisa naik untuk heavy agentic usage"
    ],
    sources: [
      {
        label: "GitHub Copilot Pricing",
        url: "https://github.com/features/copilot/plans",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09",
    assumptions: [
      "Flat seat pricing tanpa overage untuk usage normal",
      "Workspace features dapat tambah $5/bulan jika diaktifkan intensif",
      "Estimasi untuk penggunaan standar IDE + chat"
    ],
    confidence: "high",
    effectivePerMTokUsd: 12
  },
  {
    id: "github-copilot-business",
    name: "GitHub Copilot Business",
    vendor: "GitHub",
    category: "ide",
    billing: "seat",
    stickerUsd: 19,
    bandLowUsd: 19,
    bandHighUsd: 30,
    includes: [
      "Semua fitur Individual",
      "Policy management",
      "Organization-wide settings",
      "IP indemnity"
    ],
    caveats: [
      "Minimum 1 seat",
      "Harga dasar $19/seat/bulan",
      "Fitur agentic dan extended usage dapat menambah TCO per seat"
    ],
    sources: [
      {
        label: "GitHub Copilot Pricing",
        url: "https://github.com/features/copilot/plans",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09",
    assumptions: [
      "Flat seat pricing $19/bulan per developer",
      "Extended context dan workspace dapat tambah $5-11/seat",
      "Estimasi untuk tim dengan moderate agentic usage"
    ],
    confidence: "high",
    effectivePerMTokUsd: 14
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
    lastVerified: "2026-09-09",
    assumptions: [
      "Penggunaan Cascade mode 50-100 flows per bulan",
      "Overage credit tidak dipublikasikan, estimasi berdasarkan pola serupa",
      "Band tinggi untuk power user dengan AI flows intensif"
    ],
    confidence: "medium",
    effectivePerMTokUsd: 18
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
      "Band $10-100 adalah estimasi untuk usage ringan-sedang"
    ],
    sources: [
      {
        label: "Anthropic API Pricing",
        url: "https://www.anthropic.com/api",
        checkedAt: "2026-09-09"
      }
    ],
    lastVerified: "2026-09-09",
    assumptions: [
      "Claude Sonnet 3.5: $3/MTok input, $15/MTok output (per Anthropic API pricing)",
      "Usage 3-30M tokens input + 0.5-5M output per bulan",
      "Pure token consumption, tidak ada seat fee"
    ],
    confidence: "high",
    effectivePerMTokUsd: 3
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
    lastVerified: "2026-09-09",
    assumptions: [
      "BYOK: biaya = token provider (GPT-4o, Claude, dll)",
      "GPT-4o Turbo ~$2.50/MTok input, $10/MTok output",
      "Usage 2-25M tokens input + 0.5-3M output per bulan"
    ],
    confidence: "medium",
    effectivePerMTokUsd: 2.5
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
    lastVerified: "2026-09-09",
    assumptions: [
      "BYOK: biaya = token provider pilihan atau $0 untuk local model",
      "Jika GPT-4: ~$2.50/MTok input, $10/MTok output",
      "Usage 0-15M tokens per bulan, atau $0 dengan Llama/Mistral lokal"
    ],
    confidence: "medium",
    effectivePerMTokUsd: 2.5
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
    lastVerified: "2026-09-09",
    assumptions: [
      "Flat $500/seat per bulan, tidak ada public detail overage",
      "Estimasi untuk usage normal autonomous agent (early access pricing)",
      "Pricing bisa berubah saat keluar dari beta"
    ],
    confidence: "low"
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
    lastVerified: "2026-09-09",
    assumptions: [
      "Usage power user: 3000-4000 fast completions per bulan",
      "Asumsi overage $0.75 per 1000 requests di atas 1000 kuota",
      "Hitung dasar $40 + (2000-3000 overage × $0.75/1000) = ~$40-100"
    ],
    confidence: "high",
    effectivePerMTokUsd: 18
  }
];
