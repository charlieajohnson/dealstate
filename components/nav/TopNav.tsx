import Link from "next/link";
import {ThemeToggle} from "./ThemeToggle";

export function TopNav() {
  return (
    <header className="top-nav">
      <nav className="shell nav-inner" aria-label="Primary navigation">
        <Link className="wordmark" href="/">
          DealState
        </Link>
        <div className="nav-links">
          <Link href="/opportunities">Opportunities</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/opportunities/project-nova">Demo deal</Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
