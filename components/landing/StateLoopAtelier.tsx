import type {CSSProperties} from "react";

type StationStyle = CSSProperties & {"--station-delay": string};

const loopStations = [
  {
    number: "01",
    label: "Ingest",
    sublabel: "Sources",
    detail: "Files, emails, notes and updates enter the source ledger.",
    artifact: "Source material",
  },
  {
    number: "02",
    label: "Derive",
    sublabel: "Facts",
    detail: "Claims become structured, source-linked facts.",
    artifact: "Derived facts",
  },
  {
    number: "03",
    label: "Reconcile",
    sublabel: "Conflicts",
    detail: "Conflicts, gaps and stale assumptions stay visible.",
    artifact: "Open issues",
  },
  {
    number: "04",
    label: "Version",
    sublabel: "Changes",
    detail: "Each review preserves what moved and why.",
    artifact: "v0.7 register",
  },
  {
    number: "05",
    label: "Act",
    sublabel: "Memo-ready",
    detail: "The team works from the latest source-backed state.",
    artifact: "Investment output",
  },
] as const;

const loopCards = [
  ["01", "Ingest", "Collect files, emails, notes, updates and artefacts."],
  ["02", "Derive", "Extract facts, claims, numbers, dates, owners and obligations."],
  ["03", "Reconcile", "Surface conflicts, unsupported claims, missing data and superseded materials."],
  ["04", "Version", "Track what changed since the last review."],
  ["05", "Act", "Ask source-backed questions and generate investment work from current state."],
] as const;

export function StateLoopAtelier() {
  return (
    <section className="state-loop-atelier" id="state-loop">
      <div className="state-loop-header">
        <div>
          <span className="state-loop-eyebrow">The state loop</span>
          <h2>From artefacts to investment state.</h2>
        </div>
        <p>
          DealState derives facts, issues, conflicts and missing items from deal materials, then keeps that state
          versioned as new information arrives.
        </p>
      </div>

      <div className="atelier-ledger" aria-label="DealState state loop">
        <div className="ledger-title-row">
          <span>Source-to-state register</span>
          <strong>v0.7</strong>
        </div>
        <div className="ledger-track">
          <svg className="ledger-path" viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true">
            <path d="M42 92 C 150 54 230 118 310 92 S 470 64 540 92 S 708 128 790 92 S 920 58 960 92" />
          </svg>
          <div className="ledger-stations">
            {loopStations.map((step, index) => (
              <article
                className="ledger-station"
                data-step={step.number}
                key={step.number}
                style={{"--station-delay": `${index * 95}ms`} as StationStyle}
              >
                <div className="station-meta">
                  <span className="station-number">{step.number}</span>
                  <span className="station-artifact">{step.artifact}</span>
                </div>
                <div>
                  <h3>{step.label}</h3>
                  <p>{step.sublabel}</p>
                </div>
                <small>{step.detail}</small>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="state-loop-cards" aria-label="State loop explanation">
        {loopCards.map(([number, title, body]) => (
          <article className="state-loop-card" key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
