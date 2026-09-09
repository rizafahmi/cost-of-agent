# Cost of Agent

**Direktori biaya nyata bulanan agen coding AI** — bukan hanya sticker price, tapi real monthly TCO (Total Cost of Ownership) termasuk seat, token usage, dan overage.

## 🇮🇩 Untuk Developer Indonesia

Sulit membandingkan biaya nyata dari berbagai AI coding agent karena:
- Beberapa pakai model **seat-based** (flat per bulan)
- Yang lain **token-based** (bayar sesuai pemakaian)
- Ada yang **hybrid** (seat + quota + overage)
- Harga sticker sering beda jauh dengan biaya aktual

**Cost of Agent** menyajikan **band biaya bulanan** berdasarkan:
- Pricing resmi dari vendor
- Pola penggunaan developer aktif
- Sumber yang terverifikasi dan transparan

## 🚀 Fitur

- ✅ **12 agen** populer (Cursor, GitHub Copilot, Windsurf, Claude Code, Devin, Aider, Continue, dll)
- ✅ **Band biaya nyata**: `$bandLowUsd – $bandHighUsd` per bulan
- ✅ **Kategori jelas**: IDE, CLI, Cloud, OSS-BYOK
- ✅ **Sumber transparan**: setiap data ada link ke pricing page resmi + tanggal cek
- ✅ **Bahasa Indonesia** untuk UI dan copy
- ✅ **Typed registry**: semua data terstruktur di `data/agents.ts`

## 📦 Instalasi & Development

```bash
# Clone repo
git clone https://github.com/rizafahmi/cost-of-agent.git
cd cost-of-agent

# Install dependencies
pnpm install
# atau: npm install

# Development server
pnpm dev
# atau: npm run dev

# Build production
pnpm build
# atau: npm run build

# Start production server
pnpm start
# atau: npm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📝 Menambah Data Agen Baru

1. Buka `data/agents.ts`
2. Tambahkan entry baru ke array `agents` dengan struktur berikut:

```typescript
{
  id: "slug-unik",              // contoh: "cursor-pro"
  name: "Nama Produk",
  vendor: "Nama Vendor",
  category: "ide" | "cli" | "cloud" | "oss-byok",
  billing: "seat" | "credits" | "token" | "hybrid",
  stickerUsd: 20,               // optional, harga advertised
  bandLowUsd: 20,               // biaya minimum realistis per bulan
  bandHighUsd: 50,              // biaya maksimum realistis per bulan
  includes: [
    "Fitur A dalam Bahasa Indonesia",
    "Fitur B dalam Bahasa Indonesia"
  ],
  caveats: [
    "Catatan penting 1 dalam Bahasa Indonesia",
    "Catatan penting 2 dalam Bahasa Indonesia"
  ],
  sources: [
    {
      label: "Nama Sumber",
      url: "https://...",
      checkedAt: "YYYY-MM-DD"
    }
  ],
  lastVerified: "YYYY-MM-DD"
}
```

### ⚠️ Aturan Penting

- **WAJIB** ada minimal 1 sumber dengan URL valid
- **JANGAN** buat angka biaya tanpa sumber kredibel
- Jika band adalah estimasi, tulis di `caveats`
- Gunakan Bahasa Indonesia untuk semua copy (`includes`, `caveats`)
- `bandLowUsd` dan `bandHighUsd` harus realistis berdasarkan usage nyata

## 🛠️ Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Clean CSS** (no framework overhead)
- **pnpm** (atau npm)

## 📄 Lisensi

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 🙏 Kontribusi

Pull request welcome! Pastikan:
1. Data baru ada sumber yang valid
2. Build berhasil (`pnpm build`)
3. Copy dalam Bahasa Indonesia
4. Format sesuai type `AgentCost`

## 📮 Kontak

Dibuat oleh [@rizafahmi](https://github.com/rizafahmi)

---

**Catatan**: Data biaya adalah estimasi berdasarkan sumber publik dan pola penggunaan umum. Biaya aktual Anda bisa berbeda tergantung intensitas penggunaan. Selalu cek pricing page resmi vendor untuk informasi terkini.
