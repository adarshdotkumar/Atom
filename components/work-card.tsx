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
