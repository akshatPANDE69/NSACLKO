import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../components/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <nav id="navbar" className="fixed top-0 w-full z-[1000] transition-all duration-500">
      <div className="nav-container flex items-center justify-between mx-auto px-6 py-4 max-w-[1400px]">
        {/* Brand Header with Live Status Dot */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-white font-light uppercase tracking-[8px] text-[28px] font-[300] transition-all">
            NASA SPACE APPS
          </span>
          <span className="text-white font-light uppercase tracking-[4px] text-[18px] font-[300] transition-all">
            LUCKNOW
          </span>
          <span className="relative flex h-3 w-3 ml-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 cyber-glow-dot"></span>
          </span>
        </Link>

        {/* Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="nav-links flex list-none gap-8">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className="nav-link text-white no-underline font-light uppercase text-[14px] font-[300] tracking-[1px] px-4 py-2 transition-all duration-300 hover:text-cyan-400 relative">
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/challenges" className="nav-link text-white no-underline font-light uppercase text-[14px] font-[300] tracking-[1px] px-4 py-2 transition-all duration-300 hover:text-cyan-400 relative">
                  Challenges
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/timeline" className="nav-link text-white no-underline font-light uppercase text-[14px] font-[300] tracking-[1px] px-4 py-2 transition-all duration-300 hover:text-cyan-400 relative">
                  Timeline
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact" className="nav-link text-white no-underline font-light uppercase text-[14px] font-[300] tracking-[1px] px-4 py-2 transition-all duration-300 hover:text-cyan-400 relative">
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Prominent CTA Button */}
        <div className="flex items-center">
          <a
            href="https://www.spaceappschallenge.org/2026/local-events/lucknow/"
            target="_blank"
            rel="noopener noreferrer"
            className="register-cta group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          >
            <span className="relative z-10 flex items-center gap-2 px-6 py-3 text-white font-light uppercase tracking-[2px] text-[14px] font-[300] transition-all duration-400">
              <span className="relative">
                REGISTER 2026
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-md -z-10"></span>
              </span>
            </span>
            <span className="absolute inset-0 border-2 border-cyan-400/70 rounded-md bg-cyan-400/5 backdrop-blur-md transition-all duration-400 group-hover:border-cyan-300 group-hover:bg-cyan-400/15 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"></span>
            <span className="absolute inset-0 rounded-md overflow-hidden">
              <span className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-shine"></span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
}