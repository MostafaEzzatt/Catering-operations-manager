"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";
import { ModeToggle } from "./ui/theme-toggle";

const navList = [
  { href: "/", text: "اعدادالرحلات و الوجبات" },
  { href: "/add-companys", text: "الشركات" },
  { href: "/reports", text: "التقارير" },
];

const Navbar = () => {
  return (
    <nav className="px-6 py-3 border-b border-dashed mb-8 print:hidden">
      <div className="flex justify-between items-center container mx-auto">
        {/* Navigation Section */}
        <NavigationMenu dir="rtl">
          <NavigationMenuList>
            {navList.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href} passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-base font-medium", // Optional: adjusting font for Arabic readability
                    )}
                  >
                    {link.text}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
