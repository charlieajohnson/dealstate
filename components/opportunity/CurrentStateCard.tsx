import type {Document, StateSnapshot} from "@/lib/schemas";
import {ConfidenceTag, MetricProvenance, SourceCitation} from "@/components/common/Provenance";

function countUniqueSources(state: StateSnapshot) {
  return new Set(Object.values(state.key_metrics).flatMap((metric) => metric.citations.map((citation) => citation.source_id)))
    .size;
}

export function CurrentStateCard({documents, state}: {documents: Document[]; state: StateSnapshot}) {
  const received = documents.filter((document) => document.status === "received").length;
  const missing = documents.filter((document) => document.status === "missing" || document.status === "requested").length;
  const superseded = documents.filter((document) => document.status === "superseded").length;
  const sources = Math.max(documents.length, received, countUniqueSources(state));

  return (
    <section className="card module current-state" aria-labelledby="current-state-title" id="overview">
      <div className="module-head">
        <div>
          <span className="module-kicker">Current state</span>
          <h2 className="module-title" id="current-state-title">
            What is currently true
          </h2>
        </div>
        <ConfidenceTag value={state.confidence} />
      </div>

      <p className="current-view">
        Continue diligence. The category and growth remain attractive, but revenue quality, retention evidence and
        customer concentration still need source-backed reconciliation.
      </p>

      <div className="state-summary" aria-label="Project Nova state summary">
        <div>
          <span>Status</span>
          <strong>Active review</strong>
        </div>
        <div>
          <span>Confidence</span>
          <strong>{state.confidence}</strong>
        </div>
        <div>
          <span>Sources</span>
          <strong className="numeric">{sources}</strong>
        </div>
        <div>
          <span>Open issues</span>
          <strong className="numeric">{state.key_risks.length}</strong>
        </div>
        <div>
          <span>Missing items</span>
          <strong className="numeric">{missing}</strong>
        </div>
        <div>
          <span>Superseded</span>
          <strong className="numeric">{superseded}</strong>
        </div>
      </div>

      <div className="metrics" id="metrics">
        {Object.entries(state.key_metrics).map(([key, metric]) => (
          <div className="metric" key={key}>
            <span>{metric.label}</span>
            <strong className="numeric">{metric.value}</strong>
            <span className="provenance">
              <MetricProvenance metric={metric} />
            </span>
            {metric.conflicts.length ? (
              <div className="conflict">
                <span>Conflicts with</span>
                {metric.conflicts.map((conflict, index) => (
                  <span key={index}>
                    <strong className="numeric">{conflict.value}</strong>
                    {conflict.citations.map((source) => (
                      <SourceCitation key={source.source_id} source={source} />
                    ))}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="coverage">
        <div>
          <strong className="numeric">{state.source_coverage_score}%</strong>
          <span>source coverage</span>
        </div>
        <progress value={state.source_coverage_score} max="100" aria-label={`${state.source_coverage_score}% source coverage`} />
      </div>
    </section>
  );
}
