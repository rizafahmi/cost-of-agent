# 💰 Cost of Agent

Direktori biaya agen coding AI — harga nyata bulanan (seat + token + overage), bukan sticker. Bahasa Indonesia.

## Tentang Proyek

Cost of Agent adalah direktori publik yang menampilkan biaya **nyata** dari berbagai AI coding agent. Bukan cuma harga sticker yang tertera di website resmi, tapi total cost of ownership (TCO) bulanan yang mencakup:

- Biaya seat/subscription dasar
- Biaya token usage
- Overage charges
- Biaya tambahan lainnya

**Audience:** Creator dan developer Indonesia yang ingin membandingkan biaya berbagai AI coding tools.

## Stack Teknologi

- **Framework:** Astro (static site generator)
- **Language:** TypeScript
- **Output:** Static HTML (SSG / `output: 'static'`)
- **Package Manager:** pnpm (atau npm)

**Catatan:** Proyek ini **tidak menggunakan Next.js**. Ini adalah situs statis murni yang di-generate dengan Astro.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build static site
pnpm build

# Preview production build
pnpm preview
```

## Struktur Data

Data agen disimpan di `src/data/agents.ts` sebagai typed array:

```typescript
type AgentCost = {
  id: string              // URL slug
  name: string            // Nama produk
  vendor: string          // Nama perusahaan
  category: "ide" | "cli" | "cloud" | "oss-byok"
  billing: "seat" | "credits" | "token" | "hybrid"
  stickerIdr?: number     // Harga sticker dalam IDR (opsional)
  stickerUsd?: number     // Harga sticker dalam USD (opsional)
  bandLowUsd: number      // Biaya nyata minimum per bulan
  bandHighUsd: number     // Biaya nyata maksimum per bulan
  includes: string[]      // Fitur yang termasuk (Bahasa Indonesia)
  caveats: string[]       // Catatan penting (Bahasa Indonesia)
  sources: Array<{        // Sumber data (wajib)
    label: string
    url: string
    checkedAt: string     // YYYY-MM-DD
  }>
  lastVerified: string    // YYYY-MM-DD
}
```

## Menambah Data Agen Baru

1. Buka file `src/data/agents.ts`
2. Tambahkan entry baru ke array `agents`
3. **Wajib:** Sertakan sumber data yang valid (link resmi ke pricing page)
4. Gunakan Bahasa Indonesia untuk `includes` dan `caveats`
5. Jangan mengarang data invoice — gunakan sumber resmi atau tandai sebagai estimasi di `caveats`

Contoh:

```typescript
{
  id: "nama-produk",
  name: "Nama Produk",
  vendor: "Nama Vendor",
  category: "ide",
  billing: "hybrid",
  stickerUsd: 20,
  bandLowUsd: 20,
  bandHighUsd: 50,
  includes: [
    "Fitur A unlimited",
    "Akses model premium",
    "Support 24/7"
  ],
  caveats: [
    "Overage dikenakan setelah kuota",
    "Estimasi band tinggi untuk heavy usage"
  ],
  sources: [
    {
      label: "Official Pricing Page",
      url: "https://example.com/pricing",
      checkedAt: "2026-09-09"
    }
  ],
  lastVerified: "2026-09-09"
}
```

## Kontribusi

Pull requests welcome! Pastikan:

1. Data disertai sumber resmi
2. Copy menggunakan Bahasa Indonesia
3. `pnpm build` berhasil tanpa error
4. Tidak ada dependency Next.js

## License

MIT
