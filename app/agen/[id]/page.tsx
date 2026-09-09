import Link from "next/link";
import { agents, type AgentCost } from "@/data/agents";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return agents.map((agent) => ({
    id: agent.id,
  }));
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
        <div className="vendor">{agent.vendor}</div>

        <div className="badges">
          <span className={`badge badge-${agent.category}`}>
            {agent.category.toUpperCase()}
          </span>
          <span className={`badge badge-${agent.billing}`}>
            {agent.billing}
          </span>
        </div>
      </div>

      <div className="detail-section">
        <h2>Perbandingan Harga</h2>
        <div className="pricing-comparison">
          {agent.stickerUsd && (
            <div className="price-box sticker-box">
              <div className="label">Sticker Price</div>
              <div className="value">${agent.stickerUsd}/bln</div>
            </div>
          )}
          <div className="price-box band-box">
            <div className="label">Biaya Nyata (Band)</div>
            <div className="value">
              ${agent.bandLowUsd}–${agent.bandHighUsd}
            </div>
            <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              per bulan
            </div>
          </div>
        </div>
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
          Biaya nyata mencakup seat/subscription, usage token, dan potensi
          overage berdasarkan pola penggunaan developer aktif.
        </p>
      </div>

      <div className="detail-section">
        <h2>Termasuk</h2>
        <ul>
          {agent.includes.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h2>Catatan Penting</h2>
        <ul>
          {agent.caveats.map((caveat, idx) => (
            <li key={idx}>{caveat}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h2>Sumber Data</h2>
        <div className="sources">
          {agent.sources.map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link"
            >
              {source.label} (dicek: {source.checkedAt})
            </a>
          ))}
        </div>
        <div className="last-verified">
          Terakhir diverifikasi: {agent.lastVerified}
        </div>
      </div>

      <footer>
        <Link href="/" className="back-link">
          ← Kembali ke daftar
        </Link>
      </footer>
    </div>
  );
}
