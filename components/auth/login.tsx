"use client";

import { signIn } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginProps = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginProps>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginProps) => {
    setIsLoading(true);
    try {
      await signIn.email(data);
      const next = searchParams?.get("redirect") || "/";
      toast.success("Signed in successfully");
      router.push(next);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Sign in failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      // better-auth social sign-in
      // @ts-expect-error - social may not be typed on our local client
      await signIn.social({ provider: "google" });
    } catch (error) {
      console.error(error);
      toast.error("Google sign-in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight text-balance">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your account
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    className={cn(
                      "h-11 bg-muted/40 transition-all rounded-lg",
                      "focus:bg-background focus:shadow-md",
                      "focus:border-indigo-300 dark:focus:border-indigo-700",
                      "placeholder:text-muted-foreground/60"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={cn(
                        "h-11 bg-muted/40 pr-10 transition-all rounded-lg",
                        "focus:bg-background focus:shadow-md",
                        "focus:border-indigo-300 dark:focus:border-indigo-700"
                      )}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                        "text-muted-foreground hover:text-indigo-600",
                        "dark:hover:text-indigo-400"
                      )}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className={cn(
              "w-full h-11 font-medium text-white rounded-lg",
              "bg-indigo-600 hover:bg-indigo-700",
              "shadow-sm hover:shadow-md transition-all"
            )}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      {/* Or divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Social */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 rounded-lg"
        onClick={onGoogle}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5 mr-2"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12 c3.059,0,5.842,1.153,7.961,3.039l5.657-5.657C32.843,6.053,28.691,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.68,16.108,19.016,13,24,13c3.059,0,5.842,1.153,7.961,3.039l5.657-5.657 C32.843,6.053,28.691,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.185,0,9.86-1.977,13.409-5.197l-6.197-5.238C28.861,35.091,26.553,36,24,36 c-5.202,0-9.62-3.317-11.283-7.946l-6.55,5.047C9.49,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.094,5.565 c0.001-0.001,0.002-0.001,0.003-0.002l6.197,5.238C36.961,39.008,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      {/* Footer link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
        </span>
        <button
          type="button"
          onClick={() =>
            router.push(
              `/auth?tab=register&redirect=${encodeURIComponent(
                searchParams?.get("redirect") || "/"
              )}`
            )
          }
          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
