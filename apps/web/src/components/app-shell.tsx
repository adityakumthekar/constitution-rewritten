"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Governance chat" },
  { href: "/transparency", label: "Transparency" },
  { href: "/login", label: "Sign in" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/80 backdrop-blur-sm bg-background/70 sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold tracking-tight">
            abstract-party
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 rounded-md transition-colors",
                  pathname === l.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
