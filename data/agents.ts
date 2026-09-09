export type AgentCost = {
  id: string; // slug: "cursor-pro"
  name: string;
  vendor: string;
  category: "ide" | "cli" | "cloud" | "oss-byok";
  billing: "seat" | "credits" | "token" | "hybrid";
  stickerIdr?: number;
  stickerUsd?: number;
  bandLowUsd: number;
  bandHighUsd: number;
  includes: string[]; // Bahasa bullets
  caveats: string[]; // Bahasa
  sources: { label: string; url: string; checkedAt: string }[];
  lastVerified: string; // YYYY-MM-DD
};

export const agents: AgentCost[] = [
  {
    id: "cursor-pro",
    name: "Cursor Pro",
    vendor: "Cursor",
    category: "ide",
    billing: "seat",
    stickerUsd: 20,
    stickerIdr: 320000,
    bandLowUsd: 20,
    bandHighUsd: 50,
    includes: [
      "500 completions premium AI per bulan",
      "Akses model GPT-4o, Claude 3.5 Sonnet",
      "Unlimited slow premium requests",
      "10 uses/hari GPT-4 (deprecated)",
    ],
    caveats: [
      "Overage $4 per 500 fast premium requests tambahan",
      "Heavy user bisa mencapai $40-50/bulan dengan overage",
      "Tidak termasuk biaya API eksternal jika menggunakan BYOK",
    ],
    sources: [
      {
        label: "Cursor Pricing",
        url: "https://www.cursor.com/pricing",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "cursor-business",
    name: "Cursor Business",
    vendor: "Cursor",
    category: "ide",
    billing: "seat",
    stickerUsd: 40,
    stickerIdr: 640000,
    bandLowUsd: 40,
    bandHighUsd: 80,
    includes: [
      "Unlimited fast premium requests",
      "Admin dashboard & centralized billing",
      "Enforced privacy mode",
      "Semua fitur Cursor Pro",
    ],
    caveats: [
      "Untuk tim dengan minimal 5 kursi",
      "Biaya tetap per kursi tanpa overage premium requests",
      "Usage ekstensif model tertentu bisa kena rate limit",
    ],
    sources: [
      {
        label: "Cursor Pricing",
        url: "https://www.cursor.com/pricing",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "github-copilot-individual",
    name: "GitHub Copilot Individual",
    vendor: "GitHub",
    category: "ide",
    billing: "seat",
    stickerUsd: 10,
    stickerIdr: 160000,
    bandLowUsd: 10,
    bandHighUsd: 10,
    includes: [
      "Code completion & suggestions",
      "Chat di editor (VS Code, JetBrains, dll)",
      "Akses GPT-4o & Claude 3.5 Sonnet",
      "CLI assistance",
    ],
    caveats: [
      "Tidak ada overage - flat rate",
      "Model usage terbatas oleh rate limit GitHub",
      "Fitur terbatas dibanding Business/Enterprise",
    ],
    sources: [
      {
        label: "GitHub Copilot Pricing",
        url: "https://github.com/features/copilot/plans",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "github-copilot-business",
    name: "GitHub Copilot Business",
    vendor: "GitHub",
    category: "ide",
    billing: "seat",
    stickerUsd: 19,
    stickerIdr: 304000,
    bandLowUsd: 19,
    bandHighUsd: 19,
    includes: [
      "Semua fitur Individual",
      "Organization policy management",
      "IP indemnity",
      "Enterprise-grade security",
    ],
    caveats: [
      "Flat rate tanpa overage",
      "Memerlukan GitHub organization",
      "Tidak termasuk Copilot Workspace (beta terpisah)",
    ],
    sources: [
      {
        label: "GitHub Copilot Pricing",
        url: "https://github.com/features/copilot/plans",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "claude-code",
    name: "Claude Code (Anthropic Console)",
    vendor: "Anthropic",
    category: "cloud",
    billing: "token",
    bandLowUsd: 25,
    bandHighUsd: 200,
    includes: [
      "Pay-per-token via Anthropic API",
      "Akses Claude 3.5 Sonnet, Claude 3 Opus",
      "Full API control & customization",
      "Tidak ada seat license",
    ],
    caveats: [
      "Biaya sangat bervariasi tergantung usage",
      "Estimasi: $25-200/bulan untuk dev aktif dengan Claude 3.5 Sonnet",
      "Perlu infrastruktur sendiri (wrapper/agent framework)",
      "Harga token: ~$3 per million input tokens, ~$15 per million output tokens (Sonnet 3.5)",
    ],
    sources: [
      {
        label: "Anthropic Pricing",
        url: "https://www.anthropic.com/pricing#anthropic-api",
        checkedAt: "2026-09-09",
      },
      {
        label: "Claude API Docs",
        url: "https://docs.anthropic.com/en/api/getting-started",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "windsurf-pro",
    name: "Windsurf Pro",
    vendor: "Codeium",
    category: "ide",
    billing: "seat",
    stickerUsd: 15,
    stickerIdr: 240000,
    bandLowUsd: 15,
    bandHighUsd: 30,
    includes: [
      "Unlimited AI completions & chat",
      "Cascade mode (flow multi-file)",
      "Akses model premium (GPT-4, Claude)",
      "Supercomplete (context-aware)",
    ],
    caveats: [
      "Usage sangat tinggi mungkin dibatasi fair-use",
      "Estimasi overage konservatif $15-30/bulan untuk heavy user",
      "Tidak ada info overage publik; asumsi berdasarkan kompetitor",
    ],
    sources: [
      {
        label: "Windsurf Pricing (via Codeium)",
        url: "https://codeium.com/windsurf",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "devin",
    name: "Devin",
    vendor: "Cognition AI",
    category: "cloud",
    billing: "seat",
    stickerUsd: 500,
    stickerIdr: 8000000,
    bandLowUsd: 500,
    bandHighUsd: 500,
    includes: [
      "Autonomous AI software engineer",
      "Akses cloud compute untuk menjalankan task",
      "Integrasi GitHub, terminal, browser",
      "Usage sudah termasuk dalam seat",
    ],
    caveats: [
      "Hanya tersedia untuk early access/invitation",
      "Harga tetap per kursi, tidak ada public overage model",
      "Belum ada info pasti tentang overage compute",
    ],
    sources: [
      {
        label: "Devin Info (Cognition AI)",
        url: "https://www.cognition.ai/devin",
        checkedAt: "2026-09-09",
      },
      {
        label: "Devin Pricing (reported via news)",
        url: "https://techcrunch.com/2024/03/12/cognition-ai-devin/",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "aider-oss",
    name: "Aider (OSS + BYOK)",
    vendor: "Aider",
    category: "oss-byok",
    billing: "token",
    bandLowUsd: 10,
    bandHighUsd: 100,
    includes: [
      "CLI tool open-source (gratis)",
      "BYOK - bawa API key sendiri (OpenAI, Anthropic, dll)",
      "Edit multi-file dengan git integration",
      "Tidak ada subscription - bayar token usage saja",
    ],
    caveats: [
      "Biaya = token usage di provider pilihan (OpenAI, Anthropic, dll)",
      "Estimasi $10-100/bulan untuk dev aktif dengan GPT-4 atau Claude",
      "Tidak ada seat license atau platform fee",
      "Perlu setup & maintenance sendiri",
    ],
    sources: [
      {
        label: "Aider GitHub",
        url: "https://github.com/paul-gauthier/aider",
        checkedAt: "2026-09-09",
      },
      {
        label: "Aider Documentation",
        url: "https://aider.chat/docs/",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "openai-api",
    name: "OpenAI API (GPT-4, o1)",
    vendor: "OpenAI",
    category: "cli",
    billing: "token",
    bandLowUsd: 20,
    bandHighUsd: 300,
    includes: [
      "Pay-per-token tanpa seat license",
      "Akses GPT-4 Turbo, GPT-4o, o1-preview, o1-mini",
      "Full API control untuk custom agent",
      "Tidak ada platform fee",
    ],
    caveats: [
      "Biaya sangat bervariasi tergantung model & usage",
      "GPT-4 Turbo: ~$10 per million input tokens, ~$30 per million output tokens",
      "o1-preview lebih mahal: ~$15 input, ~$60 output per million tokens",
      "Estimasi $20-300/bulan untuk dev coding agent aktif",
      "Perlu wrapper/agent framework sendiri",
    ],
    sources: [
      {
        label: "OpenAI Pricing",
        url: "https://openai.com/api/pricing/",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "continue-oss",
    name: "Continue (OSS + BYOK)",
    vendor: "Continue",
    category: "oss-byok",
    billing: "token",
    bandLowUsd: 10,
    bandHighUsd: 150,
    includes: [
      "VS Code & JetBrains extension open-source (gratis)",
      "BYOK - bawa API key sendiri (OpenAI, Anthropic, Ollama lokal, dll)",
      "Autocomplete & chat di editor",
      "Tidak ada subscription",
    ],
    caveats: [
      "Biaya = token usage di provider pilihan",
      "Estimasi $10-150/bulan tergantung model (GPT-4 vs lokal)",
      "Model lokal (Ollama) = $0 setelah setup hardware",
      "Perlu setup & configuration sendiri",
    ],
    sources: [
      {
        label: "Continue GitHub",
        url: "https://github.com/continuedev/continue",
        checkedAt: "2026-09-09",
      },
      {
        label: "Continue Documentation",
        url: "https://continue.dev/docs",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
];
