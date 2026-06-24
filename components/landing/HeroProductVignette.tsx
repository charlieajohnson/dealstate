import type {CSSProperties} from "react";

const sourceSlips = [
  ["Memo", "IC draft, p.4", "€17.8m ARR"],
  ["Model", "May version", "€18.4m ARR"],
  ["Email", "CFO update", "Cohort file pending"],
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
      <div className="archive-caption">
        <div>
          <span className="module-kicker">Project Nova case packet</span>
          <div className="vignette-meta" aria-label="Register facts">
            {registerFacts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        </div>
        <strong>Source-to-state register</strong>
      </div>

      <div className="source-slip-stack" aria-label="Source material">
        {sourceSlips.map(([label, meta, value], index) => (
          <article className="source-slip" key={label} style={{"--slip-index": index} as CSSProperties}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{meta}</p>
          </article>
        ))}
      </div>

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

      <div className="archive-seal">Latest state</div>
    </div>
  );
}
