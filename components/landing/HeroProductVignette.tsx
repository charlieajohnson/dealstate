import type {CSSProperties} from "react";

type SourceSlipStyle = CSSProperties & {"--slip-entry": string; "--slip-shift": string; "--slip-delay": string};

const sourceSlips = [
  ["Memo", "IC draft, p.4", "€17.8m ARR", "memo"],
  ["Model", "May version", "€18.4m ARR", "model"],
  ["Email", "CFO update", "Cohort file pending", "email"],
] as const;

const registerRows = [
  ["Current truth", "ARR currently recorded at €18.4m"],
  ["Conflict", "IC memo still carries €17.8m"],
  ["Missing item", "Customer cohort analysis requested"],
  ["Latest state", "Continue diligence"],
] as const;

const registerFacts = [
  "14 sources",
  "1 ARR conflict",
  "5 open issues",
  "v0.7 current state",
  "Medium confidence",
  "Last reviewed 22 Jun",
] as const;

export function HeroProductVignette() {
  return (
    <div className="product-vignette" aria-label="Project Nova source-to-state register preview">
      <img
        className="hero-tableau-image"
        src="/images/dealstate/hero-archive-room.webp"
        alt=""
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-tableau-overlay" aria-hidden="true" />
      <div className="hero-tableau-dots" aria-hidden="true" />
      <div className="hero-tableau-fold" aria-hidden="true" />

      <div className="archive-caption">
        <div>
          <span className="module-kicker">Project Nova case packet</span>
          <div className="vignette-meta" aria-label="Register facts">
            {registerFacts.map((fact) => (
              <span data-kind={fact.startsWith("v0.7") ? "version" : undefined} key={fact}>
                {fact}
              </span>
            ))}
          </div>
        </div>
        <strong>Source-to-state register</strong>
      </div>

      <section className="source-ledger" aria-label="Source ledger">
        <div className="register-head mini-head">
          <span className="module-kicker">Source ledger</span>
          <strong>Incoming</strong>
        </div>
        <div className="source-slip-stack">
          {sourceSlips.map(([label, meta, value, kind], index) => (
            <article
              className="source-slip"
              data-kind={kind}
              key={label}
              style={
                {
                  "--slip-entry": `${index * 8 - 18}px`,
                  "--slip-shift": `${index * 8}px`,
                  "--slip-delay": `${index * 1.12}s`,
                } as SourceSlipStyle
              }
            >
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{meta}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="provenance-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <section className="state-register" aria-label="Derived state">
        <div className="register-head">
          <span className="module-kicker">Derived register</span>
          <strong>v0.7</strong>
        </div>
        {registerRows.map(([label, value]) => (
          <div className="register-row" data-kind={label.toLowerCase().replaceAll(" ", "-")} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <div className="archive-seal">
        Latest
        <br />
        state
      </div>
    </div>
  );
}
