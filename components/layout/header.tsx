"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun, Menu, X, Search, User, LogIn } from "lucide-react";

const Header = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!isMounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <header className="w-full border-b bg-background/50 backdrop-blur-sm dark:bg-background/40 border-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* left: brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="font-semibold text-lg">Suq</span>
            </Link>

            {/* primary nav - hidden on small screens */}
            <nav className="hidden md:flex items-center gap-2 ml-4">
              <Link
                href="/buy"
                className="text-sm px-3 py-2 rounded-md hover:bg-accent/40"
              >
                Buy
              </Link>
              <Link
                href="/sell"
                className="text-sm px-3 py-2 rounded-md hover:bg-accent/40"
              >
                Sell
              </Link>
              <Link
                href="/about"
                className="text-sm px-3 py-2 rounded-md hover:bg-accent/40"
              >
                About
              </Link>
            </nav>
          </div>

          {/* right: controls */}
          <div className="flex items-center gap-2">
            {/* search - visible on md+ */}
            <form
              className="hidden md:flex items-center gap-2 bg-muted/5 dark:bg-muted/10 rounded-md px-2 py-1"
              role="search"
            >
              <input
                aria-label="Search"
                placeholder="Search products, sellers..."
                className="bg-transparent outline-none text-sm w-56 placeholder:text-muted-foreground/70"
              />
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search />
              </Button>
            </form>

            {/* theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              {isDark ? <Sun /> : <Moon />}
            </Button>

            {/* sign in / profile */}
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2"
                >
                  <LogIn className="size-4" />
                  <span>Sign in</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User />
              </Button>
            </div>

            {/* mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="px-4 pb-4 space-y-2">
          <form
            className="flex items-center gap-2 bg-muted/5 dark:bg-muted/10 rounded-md px-2 py-1"
            role="search"
          >
            <input
              aria-label="Search"
              placeholder="Search products, sellers..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground/70"
            />
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search />
            </Button>
          </form>

          <nav className="flex flex-col">
            <Link
              href="/buy"
              className="px-3 py-2 rounded-md hover:bg-accent/40"
            >
              Buy
            </Link>
            <Link
              href="/sell"
              className="px-3 py-2 rounded-md hover:bg-accent/40"
            >
              Sell
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-md hover:bg-accent/40"
            >
              About
            </Link>
            <Link
              href="/auth/signin"
              className="px-3 py-2 rounded-md hover:bg-accent/40 inline-flex items-center gap-2"
            >
              <LogIn className="size-4" /> Sign in
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
