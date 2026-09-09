import { agents } from "@/data/agents";
import Link from "next/link";

export default function Home() {
  // Sort by bandLowUsd ascending
  const sortedAgents = [...agents].sort((a, b) => a.bandLowUsd - b.bandLowUsd);

  return (
    <div className="container">
      <div className="agents-grid">
        {sortedAgents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agen/${agent.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <article className="agent-card">
              <h2>{agent.name}</h2>
              <p className="vendor">{agent.vendor}</p>

              <div className="badges">
                <span className="badge badge-category">{agent.category}</span>
                <span className="badge badge-billing">{agent.billing}</span>
              </div>

              <div className="price-info">
                {agent.stickerUsd && (
                  <div className="price-sticker">
                    Sticker: ${agent.stickerUsd}/bulan
                  </div>
                )}
                <div className="price-band">
                  ${agent.bandLowUsd} - ${agent.bandHighUsd}
                  <span className="price-band-label">biaya nyata/bulan</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
