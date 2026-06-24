import type {CSSProperties} from "react";

type AtelierPanelStyle = CSSProperties & {"--image-position": string; "--panel-delay": string};

const atelierPanels = [
  {
    kicker: "SOURCE MATERIAL",
    title: "Documents arrive",
    body: "Files, notes, numbers and fragments enter the deal room.",
    image: "/images/dealstate/source-material.webp",
    imagePosition: "center",
  },
  {
    kicker: "DERIVED FACTS",
    title: "Facts are extracted",
    body: "Claims become structured, source-linked evidence.",
    image: "/images/dealstate/derived-facts.webp",
    imagePosition: "center",
  },
  {
    kicker: "OPEN ISSUES",
    title: "Uncertainty stays visible",
    body: "Conflicts, missing items and stale assumptions remain explicit.",
    image: "/images/dealstate/open-issues.webp",
    imagePosition: "center",
  },
  {
    kicker: "MEMO-READY STATE",
    title: "The team has a current truth",
    body: "The investment view becomes versioned, auditable and reusable.",
    image: "/images/dealstate/memo-ready-state.webp",
    imagePosition: "right center",
  },
] as const;

const stateFlow = ["Documents", "Extraction", "Reconciliation", "Versioned investment state"] as const;

export function InvestmentStateAtelier() {
  return (
    <section className="shell section-band investment-atelier" id="distinction" aria-labelledby="atelier-title">
      <div className="atelier-mark" aria-hidden="true" />
      <div className="atelier-head">
        <div>
          <span className="module-kicker">THE DISTINCTION</span>
          <h2 id="atelier-title">
            Documents record what arrived.
            <br />
            Investment state records what the team believes.
          </h2>
        </div>
        <p>
          DealState keeps source material visible, but makes the derived state explicit: facts, issues, conflicts,
          missing items and memo-ready conclusions.
        </p>
      </div>

      <div className="atelier-grid" aria-label="Investment state ecosystem">
        {atelierPanels.map((panel, index) => (
          <article
            className="atelier-panel"
            key={panel.kicker}
            style={
              {"--image-position": panel.imagePosition, "--panel-delay": `${index * 90}ms`} as AtelierPanelStyle
            }
          >
            <img className="atelier-image" src={panel.image} alt="" loading="lazy" decoding="async" />
            <div className="atelier-teal" aria-hidden="true" />
            <div className="atelier-dots" aria-hidden="true" />
            <div className="atelier-panel-copy">
              <span>{panel.kicker}</span>
              <div>
                <h3>{panel.title}</h3>
                <p>{panel.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="atelier-flow" aria-label="Source to state process">
        {stateFlow.map((step, index) => (
          <span key={step}>
            <span>{step}</span>
            {index < stateFlow.length - 1 ? <b aria-hidden="true">→</b> : null}
          </span>
        ))}
      </div>
    </section>
  );
}
