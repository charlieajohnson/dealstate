import Link from "next/link";

const navItems = [
  ["Opportunities", "/opportunities"],
  ["Methodology", "/methodology"],
  ["Demo deal", "/opportunities/project-nova"],
] as const;

export function TopNav() {
  return (
    <header className="top-nav">
      <nav className="shell nav-inner" aria-label="Primary navigation">
        <Link className="wordmark" href="/">
          <span className="brand-mark" aria-hidden="true" />
          DealState
        </Link>
        <div className="nav-links">
          {navItems.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <span />
            <span />
            <span />
          </summary>
          <div className="mobile-menu-panel">
            {navItems.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </details>
      </nav>
    </header>
  );
}
