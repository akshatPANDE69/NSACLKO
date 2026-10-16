"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../components/components/ui/navigation-menu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <nav id="navbar" className="nav" aria-label="Main navigation">
      <div className="nav-container">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          NASA SPACE APPS
        </Link>

        <button ref={toggle} type="button" className="nav-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="nav-menu" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
        <div id="nav-menu" className="nav-menu" data-open={open}>
        <NavigationMenu>
          <NavigationMenuList className="nav-links">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className="nav-link" onClick={() => setOpen(false)}>
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/team" className="nav-link" onClick={() => setOpen(false)}>
                  Team
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/challenges" className="nav-link" onClick={() => setOpen(false)}>
                  Challenges
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/timeline" className="nav-link" onClick={() => setOpen(false)}>
                  Timeline
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/news" className="nav-link" onClick={() => setOpen(false)}>
                  News
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/game" className="nav-link" onClick={() => setOpen(false)}>
                  Game
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact" className="nav-link" onClick={() => setOpen(false)}>
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
