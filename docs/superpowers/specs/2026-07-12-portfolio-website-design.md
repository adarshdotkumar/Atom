# Atom Portfolio Website — Design Spec

**Date:** 2026-07-12
**Status:** Approved pending review

## Purpose

A personal portfolio website for Adarsh Kumar, built iteratively, with a
professional design → develop → deploy pipeline. Live on Vercel, source on
GitHub (`adarshdotkumar/Atom`).

## Scope

Phase 1 delivers the full site structure with placeholder content:

- **Pages:** `/` (home/about), `/projects`, `/resume`, `/contact`
- **Shared layout:** navigation + footer across all pages
- **Contact:** links only (email, GitHub, LinkedIn) — no contact form
- **Content:** placeholders throughout; real content swapped in later

Out of scope for phase 1: blog, project case-study pages, contact form,
custom domain, final branding.

## Stack

| Concern    | Choice                              | Rationale                                              |
| ---------- | ----------------------------------- | ------------------------------------------------------ |
| Framework  | Next.js (App Router, TypeScript)    | User choice; best Vercel fit; typos in content caught free |
| Styling    | Tailwind CSS                        | Fast style iteration while branding is undecided       |
| Animation  | CSS first; Framer Motion when needed | See tiered animation strategy below                    |
| Hosting    | Vercel (Hobby tier)                 | Zero-config Next.js deploys, free, preview URLs        |
| Content    | Typed data files                    | `content/profile.ts`, `content/projects.ts`            |

## Architecture

- **Multi-page** App Router structure: each section is its own route with a
  shared root layout (nav + footer).
- **Content lives in data files**, not components. Components render whatever
  the data files contain. Success test: changing a content file changes the
  site with zero component edits.
- **Animations live inside their components** (e.g. `ProjectCard` owns its
  hover/pointer effect). Adding or swapping animation tech is a one-file
  change, never a site-wide one.
- **Resume page** renders from data, with a downloadable PDF slot.

## Animation strategy (tiered, add-when-needed)

1. **CSS animations** — day one. Hover states, transitions, fade-ins, simple
   scroll reveals.
2. **Framer Motion** — added the moment the first real pointer-based or
   orchestrated effect is built (pointer glow, magnetic buttons, staggered
   entrances, page transitions).
3. **GSAP** — only if complex scroll choreography is ever concretely needed.
4. **Three.js/WebGL** — only if a 3D signature moment is ever concretely
   designed. Not planned.

No animation library is installed speculatively.

## Design workflow

- **Branding is deferred.** Start with a neutral, clean base; the visual
  language emerges through iteration.
- **Figma is involved in both directions:**
  - *Code → design:* built screens are pushed into Figma so branding
    exploration happens on real layouts.
  - *Design → code:* screens designed in Figma become the source of truth and
    are implemented faithfully.
- Day-to-day iteration happens in the browser against the local dev server.

## Deployment pipeline

1. **Develop** on feature branches, never directly on `main`.
2. **Review locally** at `localhost:3000` (hot reload).
3. **Preview:** every pushed branch gets an automatic Vercel preview URL.
4. **Ship:** merge PR to `main` → Vercel auto-deploys production. `main` is
   always deployable; rollback is one click in Vercel.

Git identity for this repo is scoped locally: commits are authored as
`Adarsh Kumar <109155553+adarshdotkumar@users.noreply.github.com>`.

## Success criteria (phase 1)

1. All four pages render locally with working navigation.
2. Site is live on a `.vercel.app` URL; a pushed commit auto-deploys.
3. Changing a content file changes the site with zero component edits.

## Known environment risks

- **Netskope SSL proxy** (Deloitte-managed machine): `npm install` may fail
  with SSL errors until the proxy cert (`~/certs/deloitte-netskope.pem`) is
  wired into npm config (`cafile`).
- **Node install** is at an Intel-Mac path (`/usr/local/bin/node`) on an
  Apple Silicon machine — verify version and arch support Next.js before
  scaffolding.

## Error handling

Minimal by design: a custom `not-found` page; no API routes or forms exist to
fail. Build-time type checking guards content-file mistakes.

## Testing approach

Phase 1 relies on the success criteria above verified manually plus the
production build (`next build`) passing in CI (Vercel). No unit-test harness
until there is logic worth testing (per YAGNI).
