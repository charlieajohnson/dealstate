import Link from "next/link";
import {InvestmentStateAtelier} from "@/components/landing/InvestmentStateAtelier";
import {HeroProductVignette} from "@/components/landing/HeroProductVignette";
import {
  ClosingCta,
  StateLoopSection,
  StateSurfacesSection,
  TrustSection,
  WorkspacePreviewSection,
} from "@/components/landing/LandingSections";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-scrim" />
        <div className="hero-maplines" aria-hidden="true" />
        <div className="shell hero-content">
          <div className="hero-copy">
            <span className="module-kicker">Live state for every deal</span>
            <h1>One live state for every deal.</h1>
            <p>
              DealState turns scattered files, emails, notes and updates into a source-backed view of what the team
              knows, believes, questions and still needs.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/opportunities/project-nova">
                View demo deal
              </Link>
              <Link className="btn hero-secondary" href="/methodology">
                Read methodology
              </Link>
            </div>
            <div className="hero-proof" aria-label="Product proof">
              <span className="tag">Source-backed</span>
              <span className="tag">Conflict-aware</span>
              <span className="tag">Always current</span>
            </div>
          </div>
          <HeroProductVignette />
        </div>
      </section>

      <InvestmentStateAtelier />
      <StateLoopSection />
      <WorkspacePreviewSection />
      <StateSurfacesSection />
      <TrustSection />
      <ClosingCta />
    </main>
  );
}
