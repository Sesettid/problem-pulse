import Link from "next/link";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/submit", label: "Submit" },
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </span>
          <span>Surface</span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
