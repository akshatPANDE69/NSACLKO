"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import "@/app/styles/navigation.css";

const links = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/challenges", label: "Challenges" },
  { href: "/timeline", label: "Timeline" },
  { href: "/news", label: "News" },
  { href: "/game", label: "Game" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !nav.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <nav ref={nav} id="navbar" className="nav" aria-label="Main navigation">
      <div className="nav-container">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>NASA SPACE APPS</Link>
        <button ref={toggle} type="button" className="nav-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen(!open)}>
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <div id="nav-menu" className="nav-menu" data-open={open}>
          <ul className="nav-links">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="nav-link" aria-current={pathname === href ? "page" : undefined}
                  onClick={() => setOpen(false)}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
