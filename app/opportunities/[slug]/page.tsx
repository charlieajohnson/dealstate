import Link from "next/link";
import {notFound} from "next/navigation";
import {OpportunityManagerChat} from "@/components/chat/OpportunityManagerChat";
import {StatusBadge} from "@/components/common/Badges";
import {ConfidenceTag} from "@/components/common/Provenance";
import {CurrentStateCard} from "@/components/opportunity/CurrentStateCard";
import {
  ClaimsLedger,
  Contacts,
  DocumentChecklist,
  LatestChangesPanel,
  OpenIssuesTable,
  SuggestedActions,
  TimelineAudit,
} from "@/components/opportunity/DashboardPanels";
import {DealScorecard} from "@/components/opportunity/DealScorecard";
import {GeneratedOutputs} from "@/components/shared/GeneratedOutputs";
import {getRepository} from "@/lib/repo";
import {computeState, diffState} from "@/lib/state-engine";

export const dynamic = "force-static";

const workspaceLinks = [
  ["Overview", "#overview"],
  ["Metrics", "#metrics"],
  ["Claims", "#claims"],
  ["Materials", "#materials"],
  ["Issues", "#issues"],
  ["Questions", "#ask"],
  ["Outputs", "#outputs"],
];

export async function generateStaticParams() {
  return (await getRepository().list()).map(({slug}) => ({slug}));
}

export default async function OpportunityPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const bundle = await getRepository().getBySlug(slug);

  if (!bundle) notFound();

  if (bundle.facts.length === 0) {
    return (
      <main className="workspace page-pad empty-state">
        <Link className="quiet-link" href="/opportunities">
          ← Opportunities
        </Link>
        <h1>{bundle.opportunity.name}</h1>
        <p>{bundle.opportunity.company_name}</p>
        <div className="card module">
          <h2>State not populated</h2>
          <p>
            This thin synthetic opportunity exists to make the workspace index credible. Project Nova is the fully
            populated demo.
          </p>
          <Link className="btn btn-primary" href="/opportunities/project-nova">
            Open Project Nova
          </Link>
        </div>
      </main>
    );
  }

  const state = computeState({
    opportunity: bundle.opportunity,
    facts: bundle.facts,
    issues: bundle.issues,
    documents: bundle.documents,
    scores: Object.values(bundle.scores),
  });
  const previous = {...state, key_metrics: {...state.key_metrics, arr: {...state.key_metrics.arr!, value: "€17.8m"}}};
  const changes = diffState(previous, state, bundle.events);

  return (
    <main className="workspace page-pad">
      <header className="opportunity-header">
        <div>
          <Link className="quiet-link" href="/opportunities">
            Opportunities
          </Link>
          <h1>{bundle.opportunity.name}</h1>
          <p>
            Source-backed synthetic demo · {bundle.opportunity.company_name} · {bundle.opportunity.sector}
          </p>
        </div>
        <div className="header-state">
          <StatusBadge value={bundle.opportunity.stage} />
          <StatusBadge value={bundle.opportunity.current_recommendation} />
          <ConfidenceTag value={bundle.opportunity.confidence} />
          <span className="tag">{bundle.documents.length} sources</span>
          <span className="tag tag-unsupported">{bundle.issues.length} open issues</span>
          <span className="muted">
            State updated <time>{bundle.opportunity.last_updated_at}</time>
          </span>
        </div>
      </header>

      <div className="deal-shell">
        <nav className="workspace-rail card" aria-label="Opportunity workspace sections">
          {workspaceLinks.map(([label, href]) => (
            <a href={href} key={href}>
              {label}
              <span className="numeric">›</span>
            </a>
          ))}
        </nav>

        <div className="workspace-grid">
          <CurrentStateCard documents={bundle.documents} state={state} />
          <ClaimsLedger state={state} />
          <OpenIssuesTable issues={bundle.issues} />
          <DealScorecard weights={bundle.weights} scores={bundle.scores} />
          <SuggestedActions state={state} />
        </div>

        <aside className="right-stack stack">
          <LatestChangesPanel changes={changes} />
          <OpportunityManagerChat responses={bundle.chatResponses} />
          <DocumentChecklist documents={bundle.documents} />
          <section className="card module">
            <span className="module-kicker">Missing context</span>
            <h2 className="module-title">Suggested requests</h2>
            <ul className="request-list">
              {bundle.documents
                .filter((doc) => doc.status === "missing" || doc.status === "requested")
                .map((doc) => (
                  <li key={doc.id}>
                    <strong>{doc.artefact_type.replaceAll("_", " ")}</strong>
                    <span>{doc.notes[0]}</span>
                  </li>
                ))}
            </ul>
          </section>
          <GeneratedOutputs slug={slug} outputs={bundle.outputs} />
          <Contacts contacts={bundle.contacts} />
        </aside>
      </div>

      <div className="bottom-band">
        <TimelineAudit events={bundle.events} />
      </div>
    </main>
  );
}
