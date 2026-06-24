import Link from "next/link";

const loop = [
  ["Ingest", "Collect files, emails, notes, updates and artefacts."],
  ["Derive", "Extract facts, claims, numbers, dates, owners and obligations."],
  ["Reconcile", "Surface conflicts, unsupported claims, missing data and superseded materials."],
  ["Version", "Track what changed since the last review."],
  ["Act", "Ask source-backed questions and generate investment work from current state."],
];

const surfaces = [
  ["Facts", "Material numbers and claims stay attached to sources."],
  ["Issues", "Risks, conflicts and unsupported claims remain visible."],
  ["Materials", "Received, missing, requested and superseded artefacts sit in one ledger."],
  ["Changes", "The team can see what moved since the last review."],
  ["Outputs", "Briefs, updates and request lists generate from current state."],
];

const closingRegister = [
  ["Current state", "Continue diligence"],
  ["Confidence", "Medium"],
  ["Source coverage", "46%"],
  ["Open issues", "5"],
] as const;

export function StateLoopSection() {
  return (
    <section className="shell section-band" id="state-loop">
      <div className="section-head">
        <div>
          <span className="module-kicker">The state loop</span>
          <h2>From artefacts to investment state.</h2>
        </div>
        <p>
          DealState derives facts, issues, conflicts and missing items from deal materials, then keeps that state
          versioned as new information arrives.
        </p>
      </div>
      <div className="source-loop-plate" aria-hidden="true" />
      <div className="loop-grid" aria-label="Input to state workflow">
        {loop.map(([title, body], index) => (
          <article className="card loop-step" key={title}>
            <span className="numeric">0{index + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WorkspacePreviewSection() {
  return (
    <section className="shell section-band workspace-preview" id="workspace-preview">
      <div className="preview-panel">
        <span className="module-kicker">Project Nova</span>
        <h2>A live state register, not a file store.</h2>
        <p className="body-large">
          Open the synthetic demo to inspect the current state, provenance, conflicts, missing materials, latest
          changes, source-backed answers and generated outputs.
        </p>
        <p>
          <Link className="btn btn-primary" href="/opportunities/project-nova">
            Enter Project Nova
          </Link>
        </p>
      </div>
      <div className="preview-stack" aria-label="Project Nova state preview">
        <div className="preview-row">
          <div>
            <span className="module-kicker">Current state</span>
            <strong>Continue diligence</strong>
            <p className="muted">Medium confidence, source coverage 46%.</p>
          </div>
          <span className="tag tag-medium">Active review</span>
        </div>
        <div className="preview-row">
          <div>
            <span className="module-kicker">Metric conflict</span>
            <strong className="numeric">€18.4m ARR vs €17.8m ARR</strong>
            <p className="muted">Model and IC memo need reconciliation.</p>
          </div>
          <span className="tag tag-unsupported">Conflict</span>
        </div>
        <div className="preview-row">
          <div>
            <span className="module-kicker">Missing material</span>
            <strong>Customer cohort analysis</strong>
            <p className="muted">Required to support NRR and retention claims.</p>
          </div>
          <span className="tag tag-medium">Requested</span>
        </div>
      </div>
    </section>
  );
}

export function StateSurfacesSection() {
  return (
    <section className="shell section-band">
      <div className="section-head">
        <div>
          <span className="module-kicker">State surfaces</span>
          <h2>The state register is the product.</h2>
        </div>
        <p>
          Chat can query the state, but the durable value is the versioned register the whole team can inspect.
        </p>
      </div>
      <div className="surface-grid">
        {surfaces.map(([title, body], index) => (
          <article className="card" key={title}>
            <span className="numeric">0{index + 1}</span>
            <h3>{title}</h3>
            <p className="muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="shell section-band method-strip">
      <article className="card">
        <span className="module-kicker">Trust model</span>
        <h2>Every material number carries provenance.</h2>
        <p className="body-large">
          Claims are not flattened into summaries. They remain attached to sources, confidence levels, conflicts and
          review status.
        </p>
        <p>
          <Link className="quiet-link" href="/methodology">
            Read the methodology
          </Link>
        </p>
      </article>
      <article className="card">
        <span className="module-kicker">Changed since last review</span>
        <h2>Catch up without the handover.</h2>
        <ul className="trust-list">
          <li>New materials</li>
          <li>Revised numbers</li>
          <li>Opened issues</li>
          <li>Resolved conflicts</li>
          <li>Superseded sources</li>
        </ul>
      </article>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="shell cta-band">
      <div className="cta-copy">
        <h2>Here is the current investment state of the deal.</h2>
        <p className="body-large">
          Where it came from, what changed, what conflicts, and what still needs review.
        </p>
        <Link className="btn btn-primary" href="/opportunities/project-nova">
          View demo deal
        </Link>
      </div>
      <div className="cta-register" aria-label="Project Nova current-state register">
        <div className="cta-register-head">
          <span className="module-kicker">Latest-state seal</span>
          <strong>Project Nova</strong>
        </div>
        {closingRegister.map(([label, value]) => (
          <div className="cta-register-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
