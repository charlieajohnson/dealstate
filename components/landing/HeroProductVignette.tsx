const metricCards = [
  {
    label: "ARR",
    value: "€18.4m",
    meta: "May model",
    confidence: "High",
    sources: ["Model", "Memo"],
  },
  {
    label: "Growth",
    value: "24%",
    meta: "FY25 ARR",
    confidence: "Medium",
    sources: ["Deck"],
  },
  {
    label: "NRR",
    value: "112%",
    meta: "cohort file missing",
    confidence: "Low",
    sources: ["Deck"],
  },
];

const changes = [
  ["+", "May financial model added", "€18.4m ARR reported"],
  ["!", "ARR conflict surfaced", "IC memo still says €17.8m"],
  ["+", "Cohort analysis requested", "Retention evidence remains open"],
  ["-", "April model superseded", "Old pipeline export marked stale"],
];

const issues = [
  "Revenue quality unclear",
  "ARR differs across materials",
  "EBITDA add-backs unsupported",
];

export function HeroProductVignette() {
  return (
    <div className="product-vignette" aria-label="Project Nova live investment-state preview">
      <div className="vignette-top">
        <div>
          <strong>Project Nova</strong>
          <div className="vignette-tabs" aria-hidden="true">
            <span>State</span>
            <span>Sources</span>
            <span>Issues</span>
            <span>Changes</span>
            <span>Outputs</span>
          </div>
        </div>
        <span className="evidence-strip">14 sources · 1 ARR conflict · 5 open issues</span>
      </div>

      <div className="vignette-body">
        <section className="vignette-panel" aria-label="Investment state">
          <h2>Investment state</h2>
          <div className="vignette-metrics">
            {metricCards.map((metric) => (
              <article className="vignette-metric" key={metric.label}>
                <div>
                  <span>{metric.label}</span>
                  <strong className="numeric">{metric.value}</strong>
                  <p className="muted">{metric.meta}</p>
                </div>
                <div>
                  <span className="tag tag-medium">{metric.confidence}</span>
                  <div className="vignette-source">
                    {metric.sources.map((source) => (
                      <span key={source}>{source}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="vignette-conflict">
            <strong>Conflict detected</strong>
            <p>May model reports €18.4m ARR. IC memo draft reports €17.8m. Review the ARR bridge before IC.</p>
          </div>
        </section>

        <aside className="vignette-rail" aria-label="Changed since last review">
          <h2>Changed since last review</h2>
          {changes.map(([symbol, title, note]) => (
            <div className="change-chip" key={title}>
              <span className="change-dot">{symbol}</span>
              <div>
                <strong>{title}</strong>
                <p className="muted">{note}</p>
              </div>
            </div>
          ))}
        </aside>

        <section className="vignette-issues" aria-label="Open diligence issues">
          <h2>Open issues</h2>
          <ol>
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
