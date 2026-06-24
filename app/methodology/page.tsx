import Link from "next/link";

const rules = [
  ["Source intake", "Normalise files, emails, notes, CRM records and generated outputs into a source ledger."],
  ["Entity and metric extraction", "Extract companies, people, dates, numbers, claims and obligations into typed state."],
  ["Claim formation", "Represent each material claim as structured data, not as a free-form paragraph."],
  ["Source attachment", "Attach every fact to a citation, or mark an inference or unsupported claim explicitly."],
  ["Conflict detection", "Keep conflicting values visible until a human or source-backed rule resolves them."],
  ["Missing material tracking", "Treat absent artefacts as part of the state, not as private analyst memory."],
  ["Versioned updates", "Record what changed since the last review so a deal team can catch up quickly."],
  ["Human review boundary", "Keep the system useful without pretending synthetic outputs are final judgement."],
];

const sections = [
  {
    title: "DealState does not treat summaries as truth.",
    body: "Every material claim, number and issue should trace back to a source, confidence level and review state. Unsupported claims remain visible as unsupported. Conflicting sources remain visible as conflicts.",
  },
  {
    title: "The state register is the durable object.",
    body: "Chat can answer questions over the state, but the operating surface is where the team inspects what is known, questioned, missing and changed.",
  },
  {
    title: "Scores are directional, not decorative.",
    body: "Nine firm dimensions produce a rounded weighted mean. Higher is more favourable. Risk dimensions therefore score mitigation, not exposure.",
  },
  {
    title: "Pass 1 is synthetic by design.",
    body: "There is no real ingestion, retrieval or model call in this demo. The point is to show the product shape and the integrity spine before wiring live connectors.",
  },
];

export default function MethodologyPage() {
  return (
    <main className="shell methodology page-pad">
      <span className="module-kicker">Trust model</span>
      <h1>Source-backed state, not loose summary.</h1>
      <p className="lead">
        The method is simple: preserve sources, derive typed state, expose gaps and conflicts, then version the current
        view as new deal material arrives.
      </p>

      <ol className="method-list" aria-label="DealState derivation method">
        {rules.map(([title, body]) => (
          <li key={title}>
            <div>
              <strong>{title}</strong>
              <p className="muted">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="method-grid">
        {sections.map((section, index) => (
          <section className="card module" key={section.title}>
            <span className="numeric">0{index + 1}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>

      <section className="method-formula card module">
        <h2>Source coverage</h2>
        <p>
          <span className="numeric">received required artefacts + sourced key metrics</span> divided by{" "}
          <span className="numeric">all required artefacts + all key metrics</span>. Project Nova computes to{" "}
          <strong className="numeric">46%</strong>.
        </p>
      </section>

      <p>
        <Link className="btn btn-primary" href="/opportunities/project-nova">
          Inspect Project Nova
        </Link>
      </p>
    </main>
  );
}
