import { agents } from "@/data/agents";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return agents.map((agent) => ({
    id: agent.id,
  }));
}

export default async function AgentDetailPage({ params }: Props) {
  const { id } = await params;
  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    notFound();
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        ← Kembali ke daftar
      </Link>

      <div className="detail-header">
        <h1>{agent.name}</h1>
        <p className="vendor">{agent.vendor}</p>
        <div className="badges">
          <span className="badge badge-category">{agent.category}</span>
          <span className="badge badge-billing">{agent.billing}</span>
        </div>
      </div>

      <div className="price-comparison">
        <h2>Perbandingan Harga</h2>
        {agent.stickerUsd && (
          <div className="price-row">
            <span className="price-label">Harga Sticker (tertulis):</span>
            <span className="price-value price-value-sticker">
              ${agent.stickerUsd}/bulan
              {agent.stickerIdr && ` (≈ Rp ${agent.stickerIdr.toLocaleString("id-ID")})`}
            </span>
          </div>
        )}
        <div className="price-row">
          <span className="price-label">Biaya Nyata Bulanan (TCO):</span>
          <span className="price-value price-value-band">
            ${agent.bandLowUsd} - ${agent.bandHighUsd}
          </span>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          Rentang biaya nyata mencakup seat + token usage + overage untuk
          pengguna dengan activity sedang hingga tinggi.
        </p>
      </div>

      <div className="detail-section">
        <h2>Yang Termasuk</h2>
        <ul>
          {agent.includes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h2>Catatan Penting</h2>
        <ul>
          {agent.caveats.map((caveat, index) => (
            <li key={index}>{caveat}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h2>Sumber Data</h2>
        <div className="sources">
          <ul>
            {agent.sources.map((source, index) => (
              <li key={index}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label}
                </a>
                {" - "}
                <span style={{ color: "#999" }}>
                  Dicek: {source.checkedAt}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="last-verified">
          Terakhir diverifikasi: {agent.lastVerified}
        </div>
      </div>
    </div>
  );
}
