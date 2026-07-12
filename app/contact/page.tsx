import { profile } from "@/content/profile";

export const metadata = {
  title: "Contact — Adarsh Kumar",
  description: "Get in touch with Adarsh Kumar.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <h1 className="animate-rise font-display text-4xl font-bold sm:text-6xl">
        Say hello<span className="text-electron">.</span>
      </h1>
      <p className="animate-rise mt-6 max-w-md text-lg text-graphite [animation-delay:150ms]">
        {profile.contactBlurb}
      </p>
      <div className="animate-rise mt-10 flex gap-8 [animation-delay:300ms]">
        <a href={profile.links.email} className="link-underline">Email</a>
        <a href={profile.links.github} className="link-underline" target="_blank" rel="noreferrer">GitHub</a>
        <a href={profile.links.linkedin} className="link-underline" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </main>
  );
}
