"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Moon,
  Sun,
  Menu,
  Search,
  ShoppingBag,
  Heart,
  User,
  LogIn,
  Settings,
  Package,
  LogOut,
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Trophy,
  Book,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "@/lib/auth-client";

type UserTypes = {
  id: string;
  name: string;
  email: string;
  photo: string;
};

const categories = [
  { name: "Electronics", href: "/category/electronics", Icon: Laptop },
  { name: "Fashion", href: "/category/fashion", Icon: Shirt },
  { name: "Home & Living", href: "/category/home", Icon: Home },
  { name: "Beauty", href: "/category/beauty", Icon: Sparkles },
  { name: "Sports", href: "/category/sports", Icon: Trophy },
  { name: "Books", href: "/category/books", Icon: Book },
];

const placeholderTexts = [
  "Search iPhone 15...",
  "Find Nike sneakers...",
  "Discover coffee makers...",
  "Explore skincare deals...",
];

export default function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchIdx, setSearchIdx] = useState(0);
  const [cartCount] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserTypes | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Mount check for theme
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Rotate placeholder text
  useEffect(() => {
    const id = setInterval(() => {
      setSearchIdx((i) => (i + 1) % placeholderTexts.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Fetch session & user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        const currentUser = session.data?.user;

        if (currentUser) {
          setIsLoggedIn(true);
          setUser({
            id: currentUser.id,
            name: currentUser.name || "User",
            email: currentUser.email,
            photo: currentUser.image ?? "",
          });
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Prevent render until mounted (avoid hydration mismatch)
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo + Categories */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <ShoppingBag className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-full bg-indigo-500/20 opacity-0 group-hover:opacity-30 blur-xl"
              />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-xl tracking-tight text-foreground"
            >
              Suq
            </motion.span>
          </Link>

          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground">
                  Categories
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="grid w-[620px] gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                      <MegaMenuItem key={cat.name} {...cat} />
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden md:flex flex-1 max-w-md mx-8"
          role="search"
        >
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" />
            <Input
              ref={searchRef}
              type="search"
              placeholder={placeholderTexts[searchIdx]}
              className="pl-10 h-10 bg-muted/40 transition-all focus:bg-background focus:shadow-md focus:border-indigo-300 dark:focus:border-indigo-700"
            />
            <AnimatePresence mode="wait">
              <motion.span
                key={searchIdx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="sr-only"
              >
                {placeholderTexts[searchIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="hidden sm:flex"
          >
            <motion.div
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </motion.div>
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5 text-foreground" />
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-indigo-600 text-white"
                >
                  {cartCount}
                </Badge>
              </motion.div>
            )}
          </Button>

          {/* User Avatar or Sign In */}
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 ring-2 ring-indigo-600/20">
                    <AvatarImage
                      src={user.photo || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user.name}
                  <p className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Link href="/auth" className="flex items-center gap-2">
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
            <SheetContent
              side="right"
              className="w-80 p-0 bg-background/95 backdrop-blur-xl"
            >
              <MobileDrawer
                isDark={isDark}
                setTheme={setTheme}
                isLoggedIn={isLoggedIn}
                user={user}
                cartCount={cartCount}
                close={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

// Mega Menu Item
const MegaMenuItem = ({
  name,
  href,
  Icon,
}: {
  name: string;
  href: string;
  Icon: React.ElementType;
}) => (
  <Link href={href} legacyBehavior passHref>
    <NavigationMenuLink className="group flex flex-col items-center gap-3 rounded-lg p-4 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
      <div className="rounded-full bg-indigo-100 p-3 group-hover:bg-indigo-200 dark:bg-indigo-900 dark:group-hover:bg-indigo-800 transition-colors">
        <Icon className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
      </div>
      <span className="text-sm font-medium text-foreground">{name}</span>
    </NavigationMenuLink>
  </Link>
);

// Mobile Drawer
const MobileDrawer = ({
  isDark,
  setTheme,
  isLoggedIn,
  user,
  cartCount,
  close,
}: {
  isDark: boolean;
  setTheme: (t: "light" | "dark") => void;
  isLoggedIn: boolean;
  user: UserTypes | null;
  cartCount: number;
  close: () => void;
}) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between p-4 border-b">
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-lg"
        onClick={close}
      >
        <ShoppingBag className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        Suq
      </Link>
    </div>

    <div className="p-4 border-b">
      <form className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="pl-10 h-10" />
      </form>
    </div>

    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
      <MobileLink href="/buy" Icon={ShoppingBag} onClick={close}>
        Buy
      </MobileLink>
      <MobileLink href="/sell" Icon={Package} onClick={close}>
        Sell
      </MobileLink>
      <MobileLink href="/about" Icon={Sparkles} onClick={close}>
        About
      </MobileLink>

      <div className="pt-4 border-t">
        <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Categories
        </p>
        {categories.map((c) => (
          <MobileLink
            key={c.name}
            href={c.href}
            onClick={close}
            className="pl-4 text-sm"
          >
            {c.name}
          </MobileLink>
        ))}
      </div>
    </nav>

    <div className="p-4 border-t space-y-3">
      {isLoggedIn && user ? (
        <>
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photo} alt={user.name} />
              <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={close}
          >
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 dark:text-red-400"
            onClick={close}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </>
      ) : (
        <Button
          asChild
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          onClick={close}
        >
          <Link href="/auth" className="flex items-center justify-center gap-2">
            <LogIn className="h-4 w-4" /> Sign In
          </Link>
        </Button>
      )}

      <Button
        variant="ghost"
        className="w-full justify-start text-sm"
        onClick={() => {
          setTheme(isDark ? "light" : "dark");
          close();
        }}
      >
        {isDark ? (
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="mr-2 h-4 w-4 text-slate-700" />
        )}
        {isDark ? "Light Mode" : "Dark Mode"}
      </Button>

      {cartCount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Cart</span>
          <Badge className="bg-indigo-600 text-white">{cartCount}</Badge>
        </div>
      )}
    </div>
  </div>
);

// Mobile Link
const MobileLink = ({
  href,
  children,
  Icon,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  Icon?: React.ElementType;
  className?: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
      className
    )}
  >
    {Icon && <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
    {children}
  </Link>
);
