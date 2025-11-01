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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginProps = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginProps>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginProps) => {
    setIsLoading(true);
    try {
      await signIn.email(data);
      router.push("/");
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

      {/* Footer link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
        </span>
        <button
          type="button"
          onClick={() => router.push("/auth")}
          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
