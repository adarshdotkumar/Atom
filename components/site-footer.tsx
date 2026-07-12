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
