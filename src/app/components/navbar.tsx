"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { event } from "@/lib/event";

const links = [
  { href: "/about", label: "About" },
  { href: "/challenges", label: "Challenges" },
  { href: "/timeline", label: "Timeline" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Main navigation">
        <Link href="/" className="site-logo" onClick={() => setOpen(false)} aria-label="NASA Space Apps Lucknow home">
          NASA SPACE APPS<span>LUCKNOW {event.year}</span>
        </Link>
        <button ref={toggle} className="nav-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <ul id="main-navigation" className="nav-links" data-open={open}>
          {links.map(({ href, label }) => (
            <li key={href}><Link href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link></li>
          ))}
          <li><a href={event.registrationUrl} className="nav-register">Register <ArrowUpRight size={15} aria-hidden="true" /></a></li>
        </ul>
      </nav>
    </header>
  );
}
