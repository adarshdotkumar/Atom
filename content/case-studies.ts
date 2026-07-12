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
