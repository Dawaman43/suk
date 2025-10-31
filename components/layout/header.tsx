"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Menu, Search, User, LogIn, ShoppingBag, Heart, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Electronics", href: "/category/electronics", icon: "Laptop" },
  { name: "Fashion", href: "/category/fashion", icon: "Shirt" },
  { name: "Home & Living", href: "/category/home", icon: "Home" },
  { name: "Beauty", href: "/category/beauty", icon: "Sparkles" },
  { name: "Sports", href: "/category/sports", icon: "Trophy" },
  { name: "Books", href: "/category/books", icon: "Book" },
];

const Header = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with auth context in real app

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!isMounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Brand + Desktop Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span>Suq</span>
            </Link>

            {/* Desktop Categories Dropdown */}
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-96 gap-3 p-4 md:grid-cols-2 lg:w-[500px]">
                      {categories.map((category) => (
                        <ListItem
                          key={category.name}
                          title={category.name}
                          href={category.href}
                          className="text-sm"
                        >
                          Explore {category.name.toLowerCase()} products
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Center: Search (Desktop) */}
          <form className="hidden lg:flex flex-1 max-w-md mx-8" role="search">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, sellers..."
                className="pl-10 pr-4 h-10 bg-muted/50"
                aria-label="Search products"
              />
            </div>
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="hidden sm:flex"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Wishlist (optional) */}
            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Auth / Profile */}
            {isLoggedIn ? (
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Button asChild variant="default" size="sm" className="hidden sm:flex">
                <Link href="/auth/signin" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <Link href="/" className="font-bold text-lg">Suq</Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Search */}
                  <div className="p-4 border-b">
                    <form role="search" className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 h-10"
                      />
                    </form>
                  </div>

                  {/* Mobile Nav */}
                  <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <MobileNavLink href="/buy">Buy</MobileNavLink>
                    <MobileNavLink href="/sell">Sell</MobileNavLink>
                    <MobileNavLink href="/about">About</MobileNavLink>

                    <div className="pt-4 border-t">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Categories
                      </p>
                      {categories.map((cat) => (
                        <MobileNavLink key={cat.name} href={cat.href} className="pl-4 text-sm">
                          {cat.name}
                        </MobileNavLink>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="p-4 border-t space-y-3">
                    {isLoggedIn ? (
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" /> Account
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href="/auth/signin" className="flex items-center justify-center gap-2">
                          <LogIn className="h-4 w-4" /> Sign In
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTheme(isDark ? "light" : "dark");
                        setMobileOpen(false);
                      }}
                      className="w-full justify-start text-sm"
                    >
                      {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

// Reusable ListItem for dropdown
const ListItem = ({
  className,
  title,
  children,
  href,
  ...props
}: {
  className?: string;
  title: string;
  children?: React.ReactNode;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>}
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

// Mobile Nav Link
const MobileNavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <Link
    href={href}
    className={cn(
      "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/80",
      className
    )}
  >
    {children}
  </Link>
);

export default Header;