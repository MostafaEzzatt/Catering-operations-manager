import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ModeToggle } from "./ui/theme-toggle";

const navList = [
  { href: "/add-companys", text: "الشركات" },
  { href: "/", text: "اعداد الرحلات" },
];

const Navbar = () => {
  return (
    <nav className="px-6 py-3 border-b border-dashed mb-8">
      <div className="flex justify-between container mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            {navList.map((i) => (
              <NavigationMenuItem key={i.href}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={i.href}>{i.text}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
