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
  Store,
  Package2,
  Receipt,
} from "lucide-react";
import { motion } from "framer-motion";

export type UserTypes = {
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

type HeaderProps = {
  user: UserTypes | null;
};

export default function HeaderClient({ user }: HeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchIdx, setSearchIdx] = useState(0);
  const [cartCount] = useState(3);
  const isLoggedIn = !!user;
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mount check (for theme transitions only; do not block SSR render)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Rotate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchIdx((i) => (i + 1) % placeholderTexts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <motion.header
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 22 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/80"
    >
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Categories */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5"
            >
              <ShoppingBag className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-black text-2xl tracking-tight text-foreground"
            >
              Suq
            </motion.span>
          </Link>

          {/* Desktop Categories */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-semibold px-3 py-2 data-[state=open]:text-indigo-600 dark:data-[state=open]:text-indigo-400">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[680px] gap-5 p-7 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                      <MegaMenuItem key={cat.name} {...cat} />
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Seller Actions (Logged In Only) */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="px-4 py-2 text-sm"
            >
              <Link href="/seller" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Sell
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="px-4 py-2 text-sm"
            >
              <Link href="/my-products" className="flex items-center gap-2">
                <Package2 className="h-4 w-4" />
                Products
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="px-4 py-2 text-sm"
            >
              <Link href="/order" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Orders
              </Link>
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden md:flex flex-1 max-w-lg mx-8 lg:mx-12"
          role="search"
        >
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder=""
              className="pl-12 pr-4 h-12 bg-muted/40 border-transparent focus:border-indigo-400 dark:focus:border-indigo-600 focus:bg-background focus:shadow-sm transition-all duration-300 rounded-xl"
            />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none">
              <TypewriterPlaceholder text={placeholderTexts[searchIdx]} />
            </div>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="hidden sm:flex h-11 w-11 hover:bg-muted/60"
          >
            <motion.div
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-600" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </motion.div>
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-11 w-11 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Heart className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-11 w-11 group"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-1 -right-1"
              >
                <Badge className="h-6 w-6 flex items-center justify-center p-0 text-xs font-bold bg-indigo-600 text-white">
                  {cartCount}
                </Badge>
              </motion.div>
            )}
          </Button>

          {/* User Menu */}
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full overflow-hidden h-11 w-11 ring-2 ring-transparent hover:ring-indigo-400 transition-all"
                >
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={user.photo} alt={user.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-semibold text-lg">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-4">
                <DropdownMenuLabel className="space-y-1">
                  <p className="font-semibold text-base">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer py-2">
                  <User className="mr-3 h-5 w-5" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2">
                  <Package className="mr-3 h-5 w-5" /> Orders
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2">
                  <Settings className="mr-3 h-5 w-5" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer py-2">
                  <LogOut className="mr-3 h-5 w-5" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-11 px-5"
            >
              <Link href="/auth" className="flex items-center gap-2.5">
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-11 w-11"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 p-0 bg-background/98 backdrop-blur-xl"
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

// Typewriter Placeholder
const TypewriterPlaceholder = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const type = () => {
      setDisplayText((prev) =>
        isDeleting
          ? text.substring(0, prev.length - 1)
          : text.substring(0, prev.length + 1)
      );
      if (!isDeleting && displayText === text) {
        timeout = setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
      }
    };
    timeout = setTimeout(type, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text]);

  return (
    <span className="text-muted-foreground text-base">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-indigo-600 ml-1 align-middle"
      />
    </span>
  );
};

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
    <NavigationMenuLink className="group flex flex-col items-center gap-4 rounded-xl p-5 transition-all hover:bg-muted/50 hover:shadow-sm">
      <div className="rounded-full bg-indigo-100 p-4 group-hover:bg-indigo-200 dark:bg-indigo-900 dark:group-hover:bg-indigo-800 transition-colors">
        <Icon className="h-7 w-7 text-indigo-700 dark:text-indigo-300" />
      </div>
      <span className="text-base font-semibold text-foreground">{name}</span>
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
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b">
      <Link href="/" className="flex items-center gap-3" onClick={close}>
        <ShoppingBag className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        <span className="font-black text-2xl text-foreground">Suq</span>
      </Link>
    </div>

    {/* Search */}
    <div className="p-5 border-b">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-12 h-12 rounded-xl bg-muted/40"
        />
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto p-5 space-y-2">
      {isLoggedIn && (
        <>
          <MobileLink href="/buy" Icon={ShoppingBag} onClick={close}>
            Buy
          </MobileLink>
          <MobileLink href="/seller" Icon={Store} onClick={close}>
            Sell
          </MobileLink>
          <MobileLink href="/my-products" Icon={Package2} onClick={close}>
            My Products
          </MobileLink>
          <MobileLink href="/orders" Icon={Receipt} onClick={close}>
            Orders
          </MobileLink>
        </>
      )}

      <div className="pt-4 border-t mt-4">
        <p className="mb-3 text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Categories
        </p>
        {categories.map((c) => (
          <MobileLink
            key={c.name}
            href={c.href}
            onClick={close}
            className="pl-8 text-base"
          >
            {c.name}
          </MobileLink>
        ))}
      </div>
    </nav>

    {/* Footer */}
    <div className="p-5 border-t space-y-4 bg-muted/20">
      {isLoggedIn && user ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-background">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.photo} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-lg font-semibold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-base"
            onClick={close}
          >
            <User className="mr-3 h-5 w-5" /> Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-base text-red-600"
            onClick={close}
          >
            <LogOut className="mr-3 h-5 w-5" /> Sign Out
          </Button>
        </div>
      ) : (
        <Button
          asChild
          className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-medium"
        >
          <Link
            href="/auth"
            className="flex items-center justify-center gap-3"
            onClick={close}
          >
            <LogIn className="h-5 w-5" /> Sign In
          </Link>
        </Button>
      )}

      <Button
        variant="ghost"
        className="w-full justify-start h-12 text-base"
        onClick={() => {
          setTheme(isDark ? "light" : "dark");
          close();
        }}
      >
        {isDark ? (
          <Sun className="mr-3 h-5 w-5 text-yellow-600" />
        ) : (
          <Moon className="mr-3 h-5 w-5" />
        )}
        {isDark ? "Light Mode" : "Dark Mode"}
      </Button>

      {cartCount > 0 && (
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="font-medium text-base">Cart</span>
          <Badge className="bg-indigo-600 text-white h-8 px-3 text-sm">
            {cartCount} items
          </Badge>
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
      "flex items-center gap-3.5 rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-muted/60 active:scale-98",
      className
    )}
  >
    {Icon && <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
    {children}
  </Link>
);
