"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Users,
  Store,
  Shield,
  Handshake,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const cardContent = [
  {
    headerIcon: <Users className="size-6" />,
    header: "For Buyers",
    content:
      "Discover a wide range of products from youth-led businesses. Enjoy zero fees on all purchases, making it easier to grow your business without extra costs.",
  },
  {
    headerIcon: <Store className="size-6" />,
    header: "For Sellers",
    content:
      "List your products and reach a broader audience without worrying about platform fees. Suq empowers young entrepreneurs to thrive in the B2B marketplace.",
  },
  {
    headerIcon: <Shield className="size-6" />,
    header: "Secure Transactions",
    content:
      "Our platform ensures secure and transparent transactions between buyers and sellers, fostering trust and reliability in every deal.",
  },
  {
    headerIcon: <Handshake className="size-6" />,
    header: "Community Support",
    content:
      "Join a vibrant community of young entrepreneurs and business owners. Share insights, collaborate, and grow together in a supportive environment.",
  },
];

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useTransform(mouseX, (v) => v - 300);
  const glowY = useTransform(mouseY, (v) => v - 300);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* ----- Animated background orbs (indigo / teal) ----- */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 size-96 rounded-full bg-indigo-400 opacity-15 blur-3xl"
          animate={{ x: [0, 130, 0], y: [0, -130, 0] }}
          transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 size-96 rounded-full bg-teal-400 opacity-15 blur-3xl"
          animate={{ x: [0, -110, 0], y: [0, 150, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ----- Mouse-following glow (single indigo) ----- */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ x: glowX, y: glowY }}
      >
        <div className="size-96 rounded-full bg-indigo-500 blur-3xl opacity-20" />
      </motion.div>

      {/* ----- Main container ----- */}
      <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ==== LEFT – Text + CTA ==== */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-7"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              <Sparkles className="size-4" />
              <span>Youth-Powered B2B Marketplace</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block text-indigo-700 dark:text-indigo-400"
              >
                Zero Fees.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-foreground"
              >
                Endless Growth.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-xl"
            >
              Suq is the youth-centric B2B platform where young entrepreneurs
              buy, sell, and scale — all with{" "}
              <strong>zero platform fees</strong>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-105 hover:shadow-xl">
                Start Buying
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-6 py-3 font-semibold text-indigo-700 backdrop-blur-sm transition-all hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900/80 dark:text-indigo-300">
                List Your Products
              </button>
            </motion.div>
          </motion.div>

          {/* ==== RIGHT – Hero Image ==== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <Image
                src="/hero-image.png"
                width={560}
                height={560}
                alt="Suq Hero"
                className="rounded-2xl shadow-2xl"
              />
              {/* subtle orbiting ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-3xl bg-indigo-400/10 blur-xl"
              />
            </div>
          </motion.div>
        </div>

        {/* ==== Feature Cards ==== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cardContent.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <Card className="h-full border-0 bg-white/70 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-xl dark:bg-slate-800/70">
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-lg bg-indigo-600 p-2 text-white transition-transform group-hover:scale-110">
                      {card.headerIcon}
                    </div>
                    <Sparkles className="size-4 text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {card.header}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
