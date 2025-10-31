"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Home, ArrowLeft, Package, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 -z-10">
          <motion.div
            className="absolute -top-40 -left-40 size-96 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 size-96 rounded-full bg-gradient-to-l from-blue-400 to-cyan-400 opacity-20 blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Mouse-following Glow */}
        <motion.div
          className="pointer-events-none fixed inset-0 -z-10 opacity-50"
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        >
          <div className="size-96 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl" />
        </motion.div>

        <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* 404 Text with Staggered Animation */}
            <div className="flex items-center justify-center gap-2">
              {[4, 0, 4].map((num, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -180 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.2,
                    type: "spring",
                    stiffness: 120,
                  }}
                  className="inline-block text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {num}
                </motion.span>
              ))}
            </div>

            {/* Floating Package */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative mx-auto -mt-8 mb-6"
            >
              <Package className="size-32 text-muted-foreground/30" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-4"
              >
                <Sparkles className="absolute left-0 top-0 size-6 text-yellow-500" />
                <Sparkles className="absolute right-0 top-1/3 size-4 text-purple-500" />
                <Sparkles className="absolute bottom-0 right-1/4 size-5 text-pink-500" />
              </motion.div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Oops! Page Not Found
              </h2>
              <p className="mx-auto max-w-md text-muted-foreground">
                The page you're looking for seems to have wandered off. It might be out shopping!
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="group">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="size-5 transition-transform group-hover:scale-110" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group">
                <Link href="/search" className="flex items-center gap-2">
                  <Search className="size-5 transition-transform group-hover:translate-x-1" />
                  Search Products
                </Link>
              </Button>
            </motion.div>

            {/* Fun Tip */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-sm text-muted-foreground"
            >
              <span className="font-medium">Pro tip:</span> Try going{" "}
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
              >
                <ArrowLeft className="size-3.5" />
                home
              </Link>{" "}
              or use the search bar above.
            </motion.p>
          </motion.div>

          {/* Brand Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <Link href="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <ShoppingBag className="size-5" />
              <span className="font-semibold">Suq</span>
              <span className="text-xs">© {new Date().getFullYear()}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}