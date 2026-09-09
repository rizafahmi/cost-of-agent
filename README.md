# Cost of Agent

**Direktori publik biaya bulanan nyata untuk AI coding agents** — mencakup seat license, token usage, dan overage, bukan sekadar sticker price.

## 🎯 Tujuan

Kebanyakan AI coding agent hanya menampilkan harga sticker (contoh: "$20/bulan"), tetapi biaya nyata bisa jauh lebih tinggi karena:

- **Overage charges** untuk penggunaan di atas kuota
- **Token usage** untuk model pay-per-token
- **Premium request fees** untuk model tertentu

Direktori ini menampilkan **rentang biaya nyata bulanan (TCO = Total Cost of Ownership)** berdasarkan sumber publik yang terverifikasi.

## 🇮🇩 Bahasa Indonesia

Semua konten UI dan copy menggunakan Bahasa Indonesia untuk audience developer dan creator Indonesia.

## 📊 Data yang Ditampilkan

Setiap agen mencakup:

- **Nama & Vendor**
- **Kategori**: IDE, CLI, Cloud, atau OSS-BYOK
- **Model Billing**: Seat, Credits, Token, atau Hybrid
- **Harga Sticker** (jika ada): Harga tertulis di situs resmi
- **Rentang Biaya Nyata**: `bandLowUsd` - `bandHighUsd` per bulan
- **Yang Termasuk**: Fitur dan kuota yang didapat
- **Catatan Penting**: Overage, limitasi, dan penjelasan biaya tambahan
- **Sumber Data**: URL sumber resmi dengan tanggal verifikasi

## 🚀 Menjalankan Lokal

```bash
# Install dependencies
npm install
# atau
pnpm install

# Jalankan development server
npm run dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🏗️ Build Production

```bash
npm run build
npm start
```

## 📝 Cara Menambahkan Data Agen Baru

1. Buka file `data/agents.ts`
2. Tambahkan objek baru ke array `agents` dengan struktur `AgentCost`:

```typescript
{
  id: "nama-slug",                    // URL-friendly slug
  name: "Nama Agen",                  // Nama resmi
  vendor: "Nama Vendor",              // Perusahaan pembuat
  category: "ide",                    // "ide" | "cli" | "cloud" | "oss-byok"
  billing: "seat",                    // "seat" | "credits" | "token" | "hybrid"
  stickerUsd: 20,                     // Harga sticker (opsional)
  stickerIdr: 320000,                 // Harga sticker dalam IDR (opsional)
  bandLowUsd: 20,                     // Biaya nyata minimal per bulan
  bandHighUsd: 50,                    // Biaya nyata maksimal per bulan
  includes: [                         // Array string dalam Bahasa Indonesia
    "Fitur 1",
    "Fitur 2",
  ],
  caveats: [                          // Array string dalam Bahasa Indonesia
    "Catatan penting 1",
    "Catatan penting 2",
  ],
  sources: [                          // Array sumber
    {
      label: "Nama Sumber",
      url: "https://example.com/pricing",
      checkedAt: "2026-09-09",      // Format: YYYY-MM-DD
    },
  ],
  lastVerified: "2026-09-09",        // Format: YYYY-MM-DD
}
```

### ⚠️ Penting: Sumber Data

**JANGAN membuat angka biaya fiktif.** Setiap data harus:

- Berasal dari sumber publik yang terverifikasi (pricing page resmi, dokumentasi, blog post resmi)
- Memiliki URL sumber di field `sources`
- Mencantumkan tanggal verifikasi di `checkedAt` dan `lastVerified`
- Jika rentang biaya adalah estimasi, jelaskan di `caveats` bahwa itu estimasi dan dasarnya apa

### 📦 Kategori

- **ide**: Editor/IDE integration (Cursor, GitHub Copilot, Windsurf, Continue)
- **cli**: Command-line tools (Aider, OpenAI API wrapper)
- **cloud**: Autonomous cloud agents (Devin, Claude Code via API)
- **oss-byok**: Open-source Bring-Your-Own-Key (Aider, Continue dengan BYOK)

### 💳 Model Billing

- **seat**: Harga per kursi/pengguna (flat atau dengan overage)
- **credits**: Sistem kredit yang dibeli di muka
- **token**: Pay-per-token dari API provider
- **hybrid**: Kombinasi seat + token/overage

## 🛠️ Stack Teknologi

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Clean CSS (tanpa framework heavy)
- **Data**: Typed registry array di `data/agents.ts`

## 📄 Lisensi

MIT

## 🤝 Kontribusi

Pull request dengan data agen baru atau update harga yang terverifikasi sangat diterima!

Pastikan:

1. Data berasal dari sumber publik yang valid
2. Semua field `sources`, `checkedAt`, dan `lastVerified` diisi
3. Copy dalam Bahasa Indonesia
4. Build berhasil (`npm run build`)

---

**Dibuat untuk komunitas developer Indonesia** 🇮🇩
