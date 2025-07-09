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
    <nav id="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          NASA SPACE APPS
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="nav-links">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className="nav-link">
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/challenges" className="nav-link">
                  Challenges
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/timeline" className="nav-link">
                  Timeline
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/registration" className="nav-link">
                  Register
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
