"use client";

import Link from "next/link";
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

        <ul className="flex gap-4">
          {navList.map((i) => (
            <li key={i.href}>
              <Link
                className={
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                }
                href={i.href}
              >
                {i.text}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
