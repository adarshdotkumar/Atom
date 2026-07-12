import Image from "next/image";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, type CaseStudySection } from "@/content/case-studies";
import { demoRegistry } from "@/components/demos/registry";

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} — Adarsh Kumar`,
    description: study.summary,
  };
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
