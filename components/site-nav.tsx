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
