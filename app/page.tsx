import Link from "next/link";
import { agents } from "@/data/agents";

export default function Home() {
  const sortedAgents = [...agents].sort(
    (a, b) => a.bandLowUsd - b.bandLowUsd
  );

  return (
    <div className="container">
      <header>
        <h1>Cost of Agent</h1>
        <p>
          Biaya nyata bulanan agen coding AI (seat + token + overage), bukan
          hanya sticker price.
        </p>
      </header>

      <main>
        <div className="agent-grid">
          {sortedAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agen/${agent.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="agent-card">
                <h2>{agent.name}</h2>
                <div className="vendor">{agent.vendor}</div>

                <div className="badges">
                  <span className={`badge badge-${agent.category}`}>
                    {agent.category.toUpperCase()}
                  </span>
                  <span className={`badge badge-${agent.billing}`}>
                    {agent.billing}
                  </span>
                </div>

                <div className="pricing">
                  {agent.stickerUsd && (
                    <div className="sticker">
                      Sticker: ${agent.stickerUsd}/bulan
                    </div>
                  )}
                  <div className="band">
                    ${agent.bandLowUsd}–${agent.bandHighUsd}
                  </div>
                  <div className="band-range">biaya nyata per bulan</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer>
        <p>
          Data terakhir diverifikasi: {agents[0]?.lastVerified || "2026-09-09"}
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          Sumber: Pricing pages resmi vendor, dokumentasi API, dan diskusi
          komunitas
        </p>
      </footer>
    </div>
  );
}
