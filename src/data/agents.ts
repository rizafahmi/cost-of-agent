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
    lastVerified: "2026-09-10",
    assumptions: [
      "Usage Pro baseline: included usage pools habis, mulai on-demand",
      "Other Models usage: ~500K tokens/bulan di Claude Sonnet 4.6 ($3/$15 per M)",
      "Estimasi token cost: (250K input × $3) + (250K output × $15) = $4.50/mo",
      "Total Pro + token overage: $20 + $4.50 = ~$24.50",
      "Floor price: $24.50 / 0.5M tokens = $49 per 1M token"
    ],
    confidence: "medium",
    effectivePerMTokUsd: 49
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
    lastVerified: "2026-09-10",
    assumptions: [
      "Pro baseline: 1,500 AI credits included ($15 value)",
      "Heavy usage: habis 1,500 credits + tambahan 2,000 credits ($20)",
      "Total: $10 seat + $20 overage = $30",
      "Token estimate: 2M-3M tokens untuk chat/review intensive",
      "Floor price: $30 / 2.5M tokens = $12 per 1M token"
    ],
    confidence: "medium",
    effectivePerMTokUsd: 12
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
    lastVerified: "2026-09-10",
    assumptions: [
      "Business seat: 1,900 credits included ($19 value)",
      "Power user: habis pool + 2,500 credits overage ($25)",
      "Total per seat: $19 + $25 = $44",
      "Token estimate: ~3M tokens untuk heavy org usage",
      "Floor price: $44 / 3M tokens = ~$14.67 per 1M token"
    ],
    confidence: "medium",
    effectivePerMTokUsd: 14.67
  },
  {
    id: "devin-pro",
    name: "Devin Pro (Desktop + Cloud)",
    vendor: "Cognition",
    category: "ide",
    billing: "hybrid",
    stickerUsd: 20,
    bandLowUsd: 20,
    bandHighUsd: 200,
    includes: [
      "Devin Desktop IDE (formerly Windsurf)",
      "Devin Cloud autonomous agents",
      "Increased daily and weekly quotas",
      "Full model access (OpenAI, Claude, Gemini)",
      "Free SWE 1.7 dan open source models",
      "Unlimited Tab completions",
      "Extra usage at API pricing"
    ],
    caveats: [
      "SATU plan family mencakup Desktop IDE + Cloud agents",
      "Tiers: Free $0, Pro $20, Max $200, Teams $80+$40/seat",
      "Windsurf acquired Juli 2025, rebranded Devin Desktop Juni 2026",
      "Quota tidak dipublikasikan dalam angka eksplisit",
      "Heavy autonomous usage dapat memicu on-demand billing"
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
      },
      {
        label: "Cognition New Self-Serve Plans",
        url: "https://cognition.com/blog/new-self-serve-plans-for-devin",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10",
    assumptions: [
      "Pro baseline $20 dengan quota tidak dipublikasi",
      "Autonomous agent usage sulit diestimasi tanpa token economics publik",
      "Public pricing tidak expose per-token cost",
      "Band $20-200 mencerminkan Pro-Max spectrum"
    ],
    confidence: "low"
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
    lastVerified: "2026-09-10",
    assumptions: [
      "Claude Pro $20: usage pool shared web+CLI",
      "Heavy CLI coding: melebihi included, trigger paid credits",
      "API rates: Sonnet 4.6 $3/$15 per M tokens",
      "Estimasi: 2M tokens/mo mixed input/output = ~$18 token cost",
      "Total: $20 seat + $18 credits = $38 / 2M = $19 per 1M token"
    ],
    confidence: "medium",
    effectivePerMTokUsd: 19
  },
  {
    id: "muse-code",
    name: "Muse Code",
    vendor: "Meta",
    category: "cli",
    billing: "seat",
    stickerUsd: 5,
    bandLowUsd: 5,
    bandHighUsd: 50,
    includes: [
      "Everyday / High / Power Usage tiers",
      "Muse Spark included",
      "Everyday: ~10–50 requests / 5h",
      "High: 3× Everyday limits",
      "Power: 10× Everyday limits",
      "Voice input and web search capabilities",
      "Subscription separate from pay-as-you-go Meta Model API"
    ],
    caveats: [
      "Harga USD tidak tercetak di halaman subscriptions resmi — banyak sumber sekunder laporkan $5/$15/$50",
      "Benefits & availability vary by region",
      "Checkout Accounts Center adalah sumber kebenaran untuk harga final",
      "Pay-as-you-go tetap ada via Meta Model API terpisah"
    ],
    sources: [
      {
        label: "Meta Muse Code Subscriptions",
        url: "https://ai.developer.meta.com/docs/muse-code/subscriptions",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10",
    confidence: "medium"
  },
  {
    id: "glm-coding-plan",
    name: "GLM Coding Plan",
    vendor: "Z.ai",
    category: "cli",
    billing: "credits",
    stickerUsd: 18,
    bandLowUsd: 18,
    bandHighUsd: 168,
    includes: [
      "GLM-5.3 & Flash models",
      "Lite: 2k credits/5h + 10k/week",
      "Pro: 12k credits/5h + 60k/week",
      "Max: 28k credits/5h + 140k/week",
      "MCP tools support",
      "Works with Claude Code/Cline/OpenCode and more"
    ],
    caveats: [
      "List monthly $18/$80/$168; yearly ~30% off mungkin di checkout",
      "Peak Mon–Fri 14:00–18:00 UTC+8 full rate, off-peak 50% discount",
      "Bukan API pay-as-you-go umum — subscription plan terpisah"
    ],
    sources: [
      {
        label: "Z.ai Subscribe",
        url: "https://z.ai/subscribe",
        checkedAt: "2026-09-10"
      },
      {
        label: "Z.ai DevPack Overview",
        url: "https://docs.z.ai/devpack/overview",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10",
    confidence: "high"
  },
  {
    id: "byteplus-modelark-code",
    name: "BytePlus ModelArk (Dola-Seed Code API)",
    vendor: "BytePlus / ByteDance",
    category: "cloud",
    billing: "token",
    bandLowUsd: 5,
    bandHighUsd: 80,
    includes: [
      "Dola-Seed-2.0-Code API access",
      "Input: $0.50 per 1M tokens",
      "Output: $3.00 per 1M tokens",
      "Pay-per-token API billing",
      "Access via ModelArk platform"
    ],
    caveats: [
      "API token bukan seat — pay-as-you-go billing",
      "Ada ModelArk Coding Plan terpisah (Lite/Pro) di https://www.byteplus.com/en/activity/codingplan",
      "Jangan campur dengan Trae IDE pricing",
      "Region availability varies",
      "Band estimate assumes blended 50/50 input/output usage"
    ],
    sources: [
      {
        label: "BytePlus ModelArk Product",
        url: "https://www.byteplus.com/product/modelark",
        checkedAt: "2026-09-10"
      },
      {
        label: "BytePlus Coding Plan",
        url: "https://www.byteplus.com/en/activity/codingplan",
        checkedAt: "2026-09-10"
      }
    ],
    lastVerified: "2026-09-10",
    assumptions: [
      "Blended rate assumption: 50% input ($0.50/M) + 50% output ($3.00/M)",
      "Effective: ($0.50 + $3.00) / 2 = $1.75 per 1M tokens",
      "Light usage: ~3M tokens/mo = $5.25",
      "Heavy usage: ~45M tokens/mo = $78.75",
      "Band $5-80 illustrates light to heavy API spend"
    ],
    confidence: "high",
    effectivePerMTokUsd: 1.75
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
    lastVerified: "2026-09-10",
    assumptions: [
      "Teams Standard seat: $40 baseline + on-demand usage",
      "Additional Cursor Token Rate: $0.25/M on third-party models",
      "Estimasi heavy user: 1M tokens/mo third-party overage",
      "Total: $40 seat + ($10 API cost + $0.25 token rate) = $50.25",
      "Floor price: $50.25 / 1M = ~$50 per 1M token"
    ],
    confidence: "medium",
    effectivePerMTokUsd: 50
  }
];
