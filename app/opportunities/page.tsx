import Link from "next/link";
import {StatusBadge} from "@/components/common/Badges";
import {ConfidenceTag} from "@/components/common/Provenance";
import {getRepository} from "@/lib/repo";

const summaries: Record<string, string> = {
  "project-nova": "Source coverage 46% · 5 open issues · 1 conflict",
  "project-atlas": "6 sources · 8 missing items · synthetic shell",
  "project-fen": "22 sources · 2 conflicts · synthetic shell",
};

export default async function OpportunitiesPage() {
  const opportunities = await getRepository().list();

  return (
    <main className="shell page-pad">
      <div className="page-intro">
        <span className="module-kicker">Case register</span>
        <h1>Opportunity register</h1>
        <p className="lead">
          Live state across active opportunities. Project Nova is fully populated; the others are thin synthetic
          shells for register context.
        </p>
      </div>

      <div className="opportunity-list">
        {opportunities.map((item) => {
          const active = item.slug === "project-nova";
          return (
            <article className="card opportunity-row" key={item.id}>
              <div>
                {active ? (
                  <Link className="quiet-link" href={`/opportunities/${item.slug}`}>
                    Open state
                  </Link>
                ) : (
                  <span className="tag">Synthetic placeholder</span>
                )}
                <h2>{item.name}</h2>
                <p className="muted">{item.company_name}</p>
                <div className="opportunity-meta">
                  <StatusBadge value={item.stage} />
                  <StatusBadge value={item.current_recommendation} />
                  <ConfidenceTag value={item.confidence} />
                </div>
              </div>
              <div>
                <p className="numeric">{summaries[item.slug] ?? `Updated ${item.last_updated_at}`}</p>
                <p className="muted">{item.internal_owner}</p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
