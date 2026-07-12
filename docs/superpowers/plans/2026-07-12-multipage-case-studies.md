# Multi-Page Structure + Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the landing page with a "Selected work" section and add per-case-study pages (`/work/[slug]`) with text, images, and interactive demo snippets, plus `/resume` and `/contact` pages under a shared nav/footer.

**Architecture:** All content stays in typed data files (`content/`); pages render whatever the data contains. Case studies are ordered lists of typed sections (`text` | `image` | `demo`); `demo` sections reference client components from a registry in `components/demos/`. Statically generated via `generateStaticParams`.

**Tech Stack:** Next.js App Router (TypeScript), Tailwind CSS v4, CSS animations. No new dependencies.

## Global Constraints

- No new npm packages (spec: animation tiers — CSS first, Framer Motion only when a concrete effect demands it; nothing here demands it)
- Brand tokens (from spec, already in `app/globals.css`): ground `#ECECF7`, ink `#17171F`, graphite `#6B6B78`, electron `#2E32E6`; fonts `--font-display` (Syne), `--font-body` (Instrument Sans)
- Every animation must be disabled under `@media (prefers-reduced-motion: reduce)`
- Content changes must never require component edits (spec success criterion 3)
- Placeholder copy throughout; links from `content/profile.ts`
- No test harness (spec: verification = `npm run build` passes + manual browser checks against dev server on port 3000)
- Commit after every task; commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

## File Structure

```
content/
  profile.ts            (exists — add role/location lines for resume/contact)
  case-studies.ts       (new — types + 3 placeholder studies + lookup fn)
  resume.ts             (new — experience/education entries)
components/
  site-nav.tsx          (new — top nav, server component)
  site-footer.tsx       (new — social links footer, server component)
  work-card.tsx         (new — case-study card for landing section)
  demos/
    registry.tsx        (new — DemoKey → component map)
    pulse-dot.tsx       (new — first interactive demo, client component)
app/
  layout.tsx            (modify — mount nav + footer)
  page.tsx              (modify — add "Selected work" section under hero)
  work/[slug]/page.tsx  (new — case study renderer)
  resume/page.tsx       (new)
  contact/page.tsx      (new)
public/work/            (new — placeholder SVG cover images)
```

---

### Task 1: Shared nav + footer in the root layout

**Files:**
- Create: `components/site-nav.tsx`
- Create: `components/site-footer.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx` (remove hero's own links row; footer owns it now)

**Interfaces:**
- Consumes: `profile` from `@/content/profile`
- Produces: `<SiteNav />`, `<SiteFooter />` (no props) — later tasks assume they exist on every page via the layout

- [ ] **Step 1: Create `components/site-nav.tsx`**

```tsx
import Link from "next/link";

const items = [
  { href: "/#work", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="flex items-center justify-between px-8 py-6 sm:px-16">
      <Link href="/" className="font-display text-lg font-bold">
        atom<span className="text-electron">.</span>
      </Link>
      <nav className="flex gap-8">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="link-underline">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create `components/site-footer.tsx`**

```tsx
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between px-8 py-6 sm:px-16">
      <p className="text-sm text-graphite">© {profile.name}</p>
      <div className="flex gap-8">
        <a href={profile.links.github} className="link-underline" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={profile.links.linkedin} className="link-underline" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={profile.links.email} className="link-underline">
          Email
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Mount both in `app/layout.tsx`** — replace the body line:

```tsx
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
// ...existing font/metadata code unchanged...
      <body className="min-h-full flex flex-col">
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
```

- [ ] **Step 4: In `app/page.tsx`, delete the bottom links `<div className="animate-rise flex gap-8 ...">…</div>` block** (footer owns links now). Change the hero's eyebrow `<p>` text from `{profile.name} · Portfolio` to `{profile.name}` (nav wordmark now says "atom."). Hero keeps `justify-between` → change to `justify-center` and add `min-h-[80vh]`.

- [ ] **Step 5: Verify in browser**

Run: screenshot `http://localhost:3000`
Expected: nav top (wordmark "atom." left, three links right), hero centered, footer bottom with © + social links. Click Resume → 404 page (expected; built in Task 5).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: shared nav and footer layout"
```

### Task 2: Case-study content model + placeholder data

**Files:**
- Create: `content/case-studies.ts`
- Create: `public/work/placeholder-a.svg`, `public/work/placeholder-b.svg`, `public/work/placeholder-c.svg`

**Interfaces:**
- Produces: types `CaseStudy`, `CaseStudySection`, `DemoKey`; array `caseStudies`; `getCaseStudy(slug: string): CaseStudy | undefined` — Tasks 3, 4, 5 consume these exact names

- [ ] **Step 1: Create `content/case-studies.ts`**

```ts
export type DemoKey = "pulse-dot";

export type CaseStudySection =
  | { type: "text"; heading?: string; body: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "demo"; demo: DemoKey; caption?: string };

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  year: string;
  cover: { src: string; alt: string };
  sections: CaseStudySection[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "placeholder-project-one",
    title: "Placeholder Project One",
    summary: "A short placeholder summary of what this project was and why it mattered.",
    year: "2026",
    cover: { src: "/work/placeholder-a.svg", alt: "Placeholder cover for project one" },
    sections: [
      { type: "text", heading: "The problem", body: "Placeholder paragraph describing the problem this project set out to solve. Replace with the real story." },
      { type: "image", src: "/work/placeholder-a.svg", alt: "Placeholder process image", caption: "Placeholder caption." },
      { type: "demo", demo: "pulse-dot", caption: "A small interaction from this project — try clicking it." },
      { type: "text", heading: "The outcome", body: "Placeholder paragraph describing results and what was learned." },
    ],
  },
  {
    slug: "placeholder-project-two",
    title: "Placeholder Project Two",
    summary: "Second placeholder summary — swap in a real project.",
    year: "2025",
    cover: { src: "/work/placeholder-b.svg", alt: "Placeholder cover for project two" },
    sections: [
      { type: "text", heading: "Context", body: "Placeholder context paragraph." },
      { type: "image", src: "/work/placeholder-b.svg", alt: "Placeholder image" },
    ],
  },
  {
    slug: "placeholder-project-three",
    title: "Placeholder Project Three",
    summary: "Third placeholder summary — swap in a real project.",
    year: "2025",
    cover: { src: "/work/placeholder-c.svg", alt: "Placeholder cover for project three" },
    sections: [
      { type: "text", heading: "Context", body: "Placeholder context paragraph." },
      { type: "image", src: "/work/placeholder-c.svg", alt: "Placeholder image" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
```

- [ ] **Step 2: Create the three placeholder covers** — same SVG, three tints. `public/work/placeholder-a.svg` (repeat for `-b` with `#DBDBEE`, `-c` with `#D2D2EA`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#E4E4F2"/>
  <circle cx="400" cy="250" r="60" fill="none" stroke="#17171F" stroke-width="6"/>
  <circle cx="490" cy="250" r="10" fill="#2E32E6"/>
</svg>
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: case study content model with placeholder data"
```

### Task 3: "Selected work" section on the landing page

**Files:**
- Create: `components/work-card.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `caseStudies`, `CaseStudy` from `@/content/case-studies`
- Produces: `<WorkCard study={CaseStudy} />`

- [ ] **Step 1: Create `components/work-card.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/content/case-studies";

export function WorkCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="group block transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="overflow-hidden rounded-lg">
        <Image
          src={study.cover.src}
          alt={study.cover.alt}
          width={800}
          height={500}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="font-display text-xl font-bold">{study.title}</h3>
        <span className="text-sm text-graphite">{study.year}</span>
      </div>
      <p className="mt-1 text-graphite">{study.summary}</p>
    </Link>
  );
}
```

- [ ] **Step 2: In `app/page.tsx`**, wrap the existing hero in a fragment and append the work section after it:

```tsx
import { caseStudies } from "@/content/case-studies";
import { WorkCard } from "@/components/work-card";
// hero JSX unchanged above; append below it, inside <main>:
      <section id="work" className="px-8 py-24 sm:px-16">
        <h2 className="font-display text-3xl font-bold">
          Selected work<span className="text-electron">.</span>
        </h2>
        <div className="mt-12 grid gap-16 sm:grid-cols-2">
          {caseStudies.map((study) => (
            <WorkCard key={study.slug} study={study} />
          ))}
        </div>
      </section>
```

- [ ] **Step 3: Verify in browser**

Run: screenshot `http://localhost:3000`, scroll to `#work`
Expected: heading "Selected work." + 3 cards in a 2-col grid; hover lifts card and zooms cover.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: selected work section on landing"
```

### Task 4: Demo registry + first interactive snippet

**Files:**
- Create: `components/demos/pulse-dot.tsx`
- Create: `components/demos/registry.tsx`

**Interfaces:**
- Consumes: `DemoKey` from `@/content/case-studies`
- Produces: `demoRegistry: Record<DemoKey, ComponentType>` — Task 5 consumes it

- [ ] **Step 1: Create `components/demos/pulse-dot.tsx`** (client component — interactions need state):

```tsx
"use client";

import { useState } from "react";

export function PulseDot() {
  const [pulses, setPulses] = useState(0);
  return (
    <button
      type="button"
      onClick={() => setPulses((n) => n + 1)}
      className="group relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-ink transition-transform duration-200 active:scale-90 motion-reduce:transition-none"
      aria-label="Pulse the dot"
    >
      <span
        key={pulses}
        className={`h-4 w-4 rounded-full bg-electron ${pulses > 0 ? "animate-ping-once" : ""}`}
      />
      <span className="absolute -bottom-8 text-sm text-graphite">
        {pulses === 0 ? "click me" : `${pulses} pulse${pulses === 1 ? "" : "s"}`}
      </span>
    </button>
  );
}
```

Add to `app/globals.css`:

```css
@keyframes ping-once {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--electron) 60%, transparent); }
  100% { box-shadow: 0 0 0 24px transparent; }
}
.animate-ping-once { animation: ping-once 0.6s ease-out; }
@media (prefers-reduced-motion: reduce) {
  .animate-ping-once { animation: none; }
}
```

- [ ] **Step 2: Create `components/demos/registry.tsx`**

```tsx
import type { ComponentType } from "react";
import type { DemoKey } from "@/content/case-studies";
import { PulseDot } from "./pulse-dot";

export const demoRegistry: Record<DemoKey, ComponentType> = {
  "pulse-dot": PulseDot,
};
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: demo registry with pulse-dot interaction"
```

### Task 5: Case study page, resume, contact

**Files:**
- Create: `app/work/[slug]/page.tsx`
- Create: `content/resume.ts`
- Create: `app/resume/page.tsx`
- Create: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `caseStudies`, `getCaseStudy`, `CaseStudySection` from `@/content/case-studies`; `demoRegistry` from `@/components/demos/registry`; `profile` from `@/content/profile`

- [ ] **Step 1: Create `app/work/[slug]/page.tsx`**

```tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, type CaseStudySection } from "@/content/case-studies";
import { demoRegistry } from "@/components/demos/registry";

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

function Section({ section }: { section: CaseStudySection }) {
  if (section.type === "text") {
    return (
      <section className="mx-auto max-w-2xl">
        {section.heading && (
          <h2 className="font-display text-2xl font-bold">{section.heading}</h2>
        )}
        <p className="mt-4 text-lg text-graphite">{section.body}</p>
      </section>
    );
  }
  if (section.type === "image") {
    return (
      <figure className="mx-auto max-w-3xl">
        <Image src={section.src} alt={section.alt} width={800} height={500} className="rounded-lg" />
        {section.caption && (
          <figcaption className="mt-2 text-sm text-graphite">{section.caption}</figcaption>
        )}
      </figure>
    );
  }
  const Demo = demoRegistry[section.demo];
  return (
    <figure className="mx-auto max-w-2xl py-8 text-center">
      <Demo />
      {section.caption && (
        <figcaption className="mt-10 text-sm text-graphite">{section.caption}</figcaption>
      )}
    </figure>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="flex-1 px-8 py-16 sm:px-16">
      <header className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-graphite">{study.year}</p>
        <h1 className="animate-rise mt-4 font-display text-4xl font-bold sm:text-6xl">
          {study.title}
          <span className="text-electron">.</span>
        </h1>
        <p className="mt-6 text-lg text-graphite">{study.summary}</p>
      </header>
      <div className="mt-16 flex flex-col gap-16">
        {study.sections.map((section, i) => (
          <Section key={i} section={section} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create `content/resume.ts`**

```ts
export const resume = {
  experience: [
    { role: "Placeholder Role", org: "Placeholder Company", period: "2024 — Present", note: "One placeholder line about what you did there." },
    { role: "Earlier Placeholder Role", org: "Another Company", period: "2022 — 2024", note: "One placeholder line about what you did there." },
  ],
  education: [
    { degree: "Placeholder Degree", school: "Placeholder University", period: "2018 — 2022" },
  ],
};
```

- [ ] **Step 3: Create `app/resume/page.tsx`**

```tsx
import { resume } from "@/content/resume";

export default function ResumePage() {
  return (
    <main className="flex-1 px-8 py-16 sm:px-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="animate-rise font-display text-4xl font-bold sm:text-6xl">
          Resume<span className="text-electron">.</span>
        </h1>
        <h2 className="mt-16 text-sm uppercase tracking-[0.3em] text-graphite">Experience</h2>
        {resume.experience.map((job) => (
          <article key={job.role} className="mt-8">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-xl font-bold">{job.role}</h3>
              <span className="text-sm text-graphite">{job.period}</span>
            </div>
            <p className="text-graphite">{job.org}</p>
            <p className="mt-2">{job.note}</p>
          </article>
        ))}
        <h2 className="mt-16 text-sm uppercase tracking-[0.3em] text-graphite">Education</h2>
        {resume.education.map((edu) => (
          <article key={edu.degree} className="mt-8 flex items-baseline justify-between">
            <div>
              <h3 className="font-display text-xl font-bold">{edu.degree}</h3>
              <p className="text-graphite">{edu.school}</p>
            </div>
            <span className="text-sm text-graphite">{edu.period}</span>
          </article>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Create `app/contact/page.tsx`**

```tsx
import { profile } from "@/content/profile";

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <h1 className="animate-rise font-display text-4xl font-bold sm:text-6xl">
        Say hello<span className="text-electron">.</span>
      </h1>
      <p className="animate-rise mt-6 max-w-md text-lg text-graphite [animation-delay:150ms]">
        The fastest way to reach me is email. I read everything.
      </p>
      <div className="animate-rise mt-10 flex gap-8 [animation-delay:300ms]">
        <a href={profile.links.email} className="link-underline">Email</a>
        <a href={profile.links.github} className="link-underline" target="_blank" rel="noreferrer">GitHub</a>
        <a href={profile.links.linkedin} className="link-underline" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Verify in browser**

Screenshots: `/work/placeholder-project-one` (title, sections, working pulse-dot demo on click), `/work/nonexistent` (404), `/resume`, `/contact`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: case study pages, resume, contact"
```

### Task 6: Full verification + push

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: compiles; static routes listed for `/`, `/resume`, `/contact`, and 3 × `/work/[slug]`

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors

- [ ] **Step 3: Browser pass** — nav from landing → card → case study → back; Resume/Contact from nav; check mobile viewport (375px) renders without horizontal scroll.

- [ ] **Step 4: Push**

```bash
git push origin main
```
