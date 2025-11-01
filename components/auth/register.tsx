"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { statesWithCities } from "../stateWithCities";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be at most 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Only letters, numbers, and underscores allowed",
      }),
    email: z.string().email({ message: "Please enter a valid email" }),
    state: z.string().optional(),
    city: z
      .string()
      .min(2, { message: "City must be at least 2 characters" })
      .max(50, { message: "City must be at most 50 characters" })
      .optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain one uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Must contain one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterSchemaType = z.infer<typeof registerSchema>;

function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      state: "",
      city: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedState = useWatch({ control: form.control, name: "state" });
  const selectedStateCities =
    statesWithCities.find((s) => s.state === watchedState)?.cities || [];

  const onSubmit = async (data: RegisterSchemaType) => {
    setIsLoading(true);
    try {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
      });

      toast.success("Welcome to Suq! Your account has been created.");
      form.reset();
      setTimeout(() => router.push("/"), 1500);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed.";
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
          Create your account
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Join Suq and start shopping
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe"
                    autoComplete="username"
                    className={cn(
                      "h-11 bg-muted/40 transition-all rounded-lg",
                      "focus:bg-background focus:shadow-md",
                      "focus:border-indigo-300 dark:focus:border-indigo-700"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      "focus:border-indigo-300 dark:focus:border-indigo-700"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">State</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-11 bg-muted/40 rounded-lg",
                          "data-[state=open]:border-indigo-300 dark:data-[state=open]:border-indigo-700"
                        )}
                      >
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statesWithCities.map(({ state }) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!watchedState}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "h-11 bg-muted/40 rounded-lg",
                          !watchedState && "text-muted-foreground/50",
                          "data-[state=open]:border-indigo-300 dark:data-[state=open]:border-indigo-700"
                        )}
                      >
                        <SelectValue
                          placeholder={
                            watchedState
                              ? "Select a city"
                              : "Select state first"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedStateCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                      autoComplete="new-password"
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
                <FormDescription>
                  Use at least 8 characters with a mix of uppercase, numbers,
                  and symbol.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
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
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>

      {/* Footer link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <button
          type="button"
          onClick={() => router.push("/auth")}
          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default Register;
