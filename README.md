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

**Live URL:** Situs ini live di [https://cost-of-agent.rizafahmi.workers.dev](https://cost-of-agent.rizafahmi.workers.dev). Domain produksi dapat diubah di `astro.config.mjs` pada field `site` setelah custom domain terkonfigurasi.

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

## Deploy

### Automatic Deployment (GitHub Actions)

Setiap push atau merge ke branch `main` akan otomatis build dan deploy ke Cloudflare Pages melalui GitHub Actions.

**Setup sekali jalan:**

1. **Dapatkan Cloudflare API Token:**
   - Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Pergi ke **My Profile** → **API Tokens** → **Create Token**
   - Gunakan template **Edit Cloudflare Workers** atau buat custom token dengan permissions:
     - Account: Cloudflare Pages (Edit)
     - Account: Account Settings (Read)
   - Copy token yang dihasilkan

2. **Dapatkan Cloudflare Account ID:**
   - Di [Cloudflare Dashboard](https://dash.cloudflare.com/), pilih account Anda
   - Account ID terlihat di sidebar kanan atau di URL

3. **Dapatkan Project Name:**
   - Project name adalah nama Cloudflare Pages project (biasanya: `cost-of-agent`)
   - Cek di **Workers & Pages** untuk nama project yang sudah ada atau yang akan digunakan

4. **Tambahkan GitHub Secrets:**
   - Buka repository: [https://github.com/rizafahmi/cost-of-agent/settings/secrets/actions](https://github.com/rizafahmi/cost-of-agent/settings/secrets/actions)
   - Klik **New repository secret** dan tambahkan tiga secret berikut:
     - `CLOUDFLARE_API_TOKEN` → token dari langkah 1
     - `CLOUDFLARE_ACCOUNT_ID` → account ID dari langkah 2
     - `CLOUDFLARE_PROJECT_NAME` → nama project (contoh: `cost-of-agent`)

5. **Done!** Setiap merge ke `main` akan otomatis deploy ke live URL.

**Workflow file:** `.github/workflows/deploy-cloudflare.yml`

### Manual Deployment (Dashboard)

Alternatif untuk deploy manual via Cloudflare Dashboard:

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Pilih **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Pilih repository: `rizafahmi/cost-of-agent`
4. **Build settings:**
   - Framework preset: **Astro** (atau **None** jika tidak tersedia)
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Node.js version: **22** atau lebih tinggi (jika diminta di Environment variables, set `NODE_VERSION=22`)
5. Klik **Save and Deploy**

**Custom domain:** Situs saat ini menggunakan domain workers.dev default. Untuk menggunakan custom domain seperti `cost-of-agent.id`, tambahkan custom domain di Cloudflare Pages settings dan update field `site` di `astro.config.mjs` setelah domain terbukti berfungsi.

**Catatan:** Deploy ini untuk situs statis murni. Tidak memerlukan Wrangler CLI atau konfigurasi tambahan — cukup connect via dashboard Cloudflare Pages.

## Kontribusi

Pull requests welcome! Pastikan:

1. Data disertai sumber resmi
2. Copy menggunakan Bahasa Indonesia
3. `pnpm build` berhasil tanpa error
4. Tidak ada dependency Next.js

## License

MIT
