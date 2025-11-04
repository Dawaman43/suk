import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth-client";

type PageProps = {
  searchParams?: { redirect?: string; tab?: string };
};

function safeRedirect(to?: string | null) {
  if (!to) return "/";
  try {
    // Only allow same-site relative paths
    const u = new URL(to, "http://localhost");
    if (to.startsWith("/") && !to.startsWith("//"))
      return u.pathname + u.search + u.hash;
  } catch {
    // ignore and fall back
  }
  return "/";
}

export default async function AuthPage({ searchParams }: PageProps) {
  // Server-side session check to avoid flashing the auth UI for logged-in users
  const hdrs = await headers();
  const cookie = hdrs.get("cookie") ?? "";
  const session = await getSession({
    fetchOptions: { headers: { cookie } },
  });

  const user = session?.data?.user;
  if (user) {
    const to = safeRedirect(searchParams?.redirect ?? "/");
    redirect(to);
  }

  const defaultTab = searchParams?.tab === "register" ? "register" : "login";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Optional subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20" />

      {/* Glassmorphic Auth Card */}
      <div
        className={cn(
          "w-full max-w-md",
          "bg-background/90 backdrop-blur-xl",
          "border border-border rounded-xl shadow-lg",
          "p-6 sm:p-8"
        )}
      >
        <Tabs defaultValue={defaultTab} className="w-full">
          {/* 2-column, 1-row Tab List */}
          <TabsList className="flex w-fit mx-auto mb-6 h-10 bg-muted/40 rounded-lg p-1">
            <TabsTrigger
              value="login"
              className={cn(
                "rounded-md px-6 py-1.5 text-sm font-medium transition-all",
                "data-[state=active]:bg-indigo-600 data-[state=active]:text-white",
                "data-[state=active]:shadow-sm"
              )}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className={cn(
                "rounded-md px-6 py-1.5 text-sm font-medium transition-all",
                "data-[state=active]:bg-indigo-600 data-[state=active]:text-white",
                "data-[state=active]:shadow-sm"
              )}
            >
              Register
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="login" className="mt-2">
            <Login />
          </TabsContent>
          <TabsContent value="register" className="mt-2">
            <Register />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
