import { profile } from "@/content/profile";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col justify-center min-h-[80vh] px-8 py-12 sm:px-16 sm:py-16">
      <p className="animate-rise text-sm uppercase tracking-[0.3em] text-graphite [animation-delay:0ms]">
        {profile.name}
      </p>

      <div className="max-w-4xl">
        <h1 className="animate-rise font-display text-5xl font-bold leading-[1.05] sm:text-8xl [animation-delay:150ms]">
          {profile.headline.before}
          <span className="atom-o" aria-hidden="true">
            <span className="atom-electron" />
          </span>
          <span className="sr-only">o</span>
          {profile.headline.after}
        </h1>
        <p className="animate-rise mt-8 max-w-xl text-lg text-graphite [animation-delay:300ms]">
          {profile.intro}
        </p>
      </div>

    </main>
  );
}
