"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!isMounted) return null;

  const isDark = resolvedTheme === "dark";
  return (
    <header>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
    </header>
  );
};

export default Header;
