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
