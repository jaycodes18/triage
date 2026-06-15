"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const onHistory = pathname === "/history";

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="glass-surface border-b border-border">
        <nav className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-accent/30 blur-[6px] group-hover:bg-accent/50 transition" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="font-semibold tracking-tight text-text-primary">
              Triage
            </span>
          </Link>

          <div className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg ${
                !onHistory
                  ? "text-text-primary bg-surface-elevated"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              New plan
            </Link>
            <Link
              href="/history"
              className={`px-3 py-1.5 rounded-lg ${
                onHistory
                  ? "text-text-primary bg-surface-elevated"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              History
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
