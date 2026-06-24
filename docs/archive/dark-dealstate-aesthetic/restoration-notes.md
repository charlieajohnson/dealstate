# Restoration Notes

To restore the old aesthetic exactly, branch from the pre-overhaul commit:

```bash
git checkout -b restore/dark-dealstate d50b35818f43ab23e34b8282309920f9f956e745
```

To reintroduce parts of it into the current app, use this archive as a reference rather than copying all theme code back into the live surface.

## Files To Review

- `app/globals.css`
- `styles/tokens.css`
- `app/layout.tsx`
- `components/nav/TopNav.tsx`
- `components/nav/ThemeToggle.tsx`
- `components/landing/HeroProductVignette.tsx`
- `components/landing/LandingSections.tsx`
- `app/opportunities/page.tsx`
- `app/opportunities/[slug]/page.tsx`
- `components/opportunity/*`

## Theme Toggle

The old light/dark toggle lived in `components/nav/ThemeToggle.tsx` and was rendered by `components/nav/TopNav.tsx`.

The layout persisted theme state with:

```text
localStorage key: dealstate-theme
document class: dark
```

The Humanist Compute Atelier rebuild removes that exposed mode switch. Any future dark-room variant should be designed as a separate mode with an explicit product reason, not restored as a leftover toggle.
