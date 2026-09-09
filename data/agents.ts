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
    vendor: "Anysphere",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 20,
    bandLowUsd: 20,
    bandHighUsd: 50,
    includes: [
      "IDE lengkap berbasis VS Code",
      "Autocomplete AI unlimited",
      "500 completions premium (GPT-4, Claude) per bulan",
      "Akses Composer",
      "10 queries Sonnet lama per bulan (slow)",
    ],
    caveats: [
      "Biaya aktual $20-50/bulan tergantung penggunaan premium completion",
      "Premium completions (GPT-4/Claude) berbatas quota 500/bulan",
      "Overage tidak tersedia; harus upgrade atau tunggu reset bulanan",
    ],
    sources: [
      {
        label: "Cursor Pricing (Official)",
        url: "https://cursor.com/pricing",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "cursor-business",
    name: "Cursor Business",
    vendor: "Anysphere",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 40,
    bandLowUsd: 40,
    bandHighUsd: 100,
    includes: [
      "Semua fitur Pro",
      "Centralized billing untuk tim",
      "Admin dashboard",
      "Enforced privacy mode",
      "Unlimited premium completions",
      "Akses model terbaru lebih cepat",
    ],
    caveats: [
      "Biaya aktual $40-100/seat/bulan tergantung intensitas penggunaan model premium",
      "Band estimasi berdasarkan pola penggunaan developer aktif",
    ],
    sources: [
      {
        label: "Cursor Pricing (Official)",
        url: "https://cursor.com/pricing",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "github-copilot-individual",
    name: "GitHub Copilot Individual",
    vendor: "GitHub/Microsoft",
    category: "ide",
    billing: "seat",
    stickerUsd: 10,
    bandLowUsd: 10,
    bandHighUsd: 10,
    includes: [
      "Code completion di editor (VS Code, JetBrains, Vim, dll)",
      "Chat di IDE",
      "CLI assistance",
      "Model: GPT-4, Claude 3.5 Sonnet",
    ],
    caveats: [
      "Harga flat $10/bulan tanpa overage atau limit keras",
      "Gratis untuk verified students, teachers, maintainer OSS populer",
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
    vendor: "GitHub/Microsoft",
    category: "ide",
    billing: "seat",
    stickerUsd: 19,
    bandLowUsd: 19,
    bandHighUsd: 19,
    includes: [
      "Semua fitur Individual",
      "Policy management untuk organisasi",
      "IP indemnity",
      "Enterprise-grade security",
    ],
    caveats: [
      "Harga flat $19/user/bulan",
      "Minimum biasanya 1-2 seat untuk org kecil",
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
    id: "windsurf-pro",
    name: "Windsurf Pro",
    vendor: "Codeium",
    category: "ide",
    billing: "seat",
    stickerUsd: 15,
    bandLowUsd: 15,
    bandHighUsd: 15,
    includes: [
      "IDE berbasis VS Code dengan Cascade AI flows",
      "Unlimited autocomplete",
      "Multi-file editing",
      "Akses ke GPT-4, Claude 3.5 Sonnet, o3-mini",
    ],
    caveats: [
      "Harga flat $15/bulan per seat",
      "Versi free tersedia dengan fitur terbatas",
    ],
    sources: [
      {
        label: "Windsurf Editor Pricing",
        url: "https://codeium.com/windsurf/pricing",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "claude-code",
    name: "Claude Code (Web)",
    vendor: "Anthropic",
    category: "cloud",
    billing: "credits",
    stickerUsd: 20,
    bandLowUsd: 20,
    bandHighUsd: 80,
    includes: [
      "Web-based coding environment",
      "Akses Claude 3.7 Sonnet",
      "Extended thinking untuk task kompleks",
      "Projects dengan context multi-file",
    ],
    caveats: [
      "Pro plan $20/bulan termasuk usage credits",
      "Biaya aktual $20-80/bulan jika heavy user dengan overage token",
      "Band estimasi berdasarkan diskusi komunitas pengguna aktif",
    ],
    sources: [
      {
        label: "Claude Pro Pricing",
        url: "https://www.anthropic.com/pricing",
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
    bandLowUsd: 500,
    bandHighUsd: 500,
    includes: [
      "AI software engineer otonom",
      "Sandboxed development environment",
      "Long-running autonomous tasks",
      "Integration dengan GitHub, Slack, Linear",
    ],
    caveats: [
      "Harga $500/seat/bulan untuk akses terbatas (waitlist/early access)",
      "Belum tersedia secara publik luas; harga bisa berubah saat GA",
      "Target: tim engineering profesional, bukan individual developer",
    ],
    sources: [
      {
        label: "Cognition AI Announcement",
        url: "https://www.cognition.ai/blog/introducing-devin",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "aider",
    name: "Aider (OSS + BYOK)",
    vendor: "Paul Gauthier",
    category: "oss-byok",
    billing: "token",
    bandLowUsd: 10,
    bandHighUsd: 100,
    includes: [
      "CLI pair programming tool (open source)",
      "Bring Your Own Key (OpenAI, Anthropic, dll)",
      "Git-aware edits",
      "Multi-file refactoring",
    ],
    caveats: [
      "Aider sendiri gratis (open source)",
      "Biaya aktual = token API: $10-100/bulan tergantung model (GPT-4, Claude, o1) dan intensitas",
      "Band estimasi berdasarkan usage developer aktif dengan Claude/GPT-4",
    ],
    sources: [
      {
        label: "Aider GitHub",
        url: "https://github.com/paul-gauthier/aider",
        checkedAt: "2026-09-09",
      },
      {
        label: "OpenAI Pricing",
        url: "https://openai.com/api/pricing/",
        checkedAt: "2026-09-09",
      },
      {
        label: "Anthropic API Pricing",
        url: "https://www.anthropic.com/pricing#anthropic-api",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "continue",
    name: "Continue (OSS + BYOK)",
    vendor: "Continue Dev",
    category: "oss-byok",
    billing: "token",
    bandLowUsd: 5,
    bandHighUsd: 80,
    includes: [
      "VS Code & JetBrains extension (open source)",
      "Bring Your Own Key atau model lokal (Ollama)",
      "Autocomplete & chat",
      "Konfigurasi model fleksibel",
    ],
    caveats: [
      "Extension gratis (open source)",
      "Biaya aktual = biaya API atau $0 jika pakai model lokal",
      "Band $5-80/bulan untuk user dengan cloud API; bisa $0 jika full local",
    ],
    sources: [
      {
        label: "Continue.dev",
        url: "https://continue.dev/",
        checkedAt: "2026-09-09",
      },
      {
        label: "Continue GitHub",
        url: "https://github.com/continuedev/continue",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "codex-openai",
    name: "OpenAI Codex API (Deprecated)",
    vendor: "OpenAI",
    category: "cli",
    billing: "token",
    stickerUsd: 0,
    bandLowUsd: 0,
    bandHighUsd: 0,
    includes: [
      "API untuk code generation (deprecated)",
      "Digantikan oleh GPT-4 dan GPT-3.5-turbo",
    ],
    caveats: [
      "Codex API sudah deprecated sejak Maret 2023",
      "Pengguna disarankan migrasi ke GPT-4 atau GPT-3.5 API",
      "Band $0 karena tidak lagi aktif dijual",
    ],
    sources: [
      {
        label: "OpenAI Codex Deprecation",
        url: "https://platform.openai.com/docs/deprecations/",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "supermaven-pro",
    name: "Supermaven Pro",
    vendor: "Supermaven",
    category: "ide",
    billing: "seat",
    stickerUsd: 10,
    bandLowUsd: 10,
    bandHighUsd: 10,
    includes: [
      "VS Code & JetBrains extension",
      "Autocomplete AI cepat (300K token context)",
      "Unlimited completions",
      "Chat assistant",
    ],
    caveats: [
      "Harga flat $10/bulan",
      "Free tier tersedia dengan rate limits",
    ],
    sources: [
      {
        label: "Supermaven Pricing",
        url: "https://supermaven.com/pricing",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
  {
    id: "tabnine-pro",
    name: "Tabnine Pro",
    vendor: "Tabnine",
    category: "ide",
    billing: "seat",
    stickerUsd: 12,
    bandLowUsd: 12,
    bandHighUsd: 12,
    includes: [
      "AI code completion untuk semua major IDEs",
      "Private model training on your code",
      "Local & cloud deployment options",
      "Zero data retention",
    ],
    caveats: [
      "Harga flat $12/user/bulan",
      "Enterprise plan dengan harga custom tersedia",
    ],
    sources: [
      {
        label: "Tabnine Pricing",
        url: "https://www.tabnine.com/pricing",
        checkedAt: "2026-09-09",
      },
    ],
    lastVerified: "2026-09-09",
  },
];
