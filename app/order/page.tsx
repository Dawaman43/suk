"use client";
// Orders page shows your product sales (reserved/sold)
// derived from existing products API.
// It includes stats and a simple list UI.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Receipt, TrendingUp } from "lucide-react";

type SessionUser = { id?: string; name?: string | null };

type UIProduct = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  sellerId: string;
  status: "available" | "sold" | "reserved";
  createdAt?: string | Date;
  location?: string;
};

function formatCurrency(n: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function statusColor(status: UIProduct["status"]) {
  switch (status) {
    case "reserved":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "sold":
      return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    default:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  }
}

function formatDate(d?: string | Date) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function OrderPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<UIProduct[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const session = await getSession();
        const u = session.data?.user as SessionUser | undefined;
        setUser(u ?? null);
      } catch {
        // ignore
      }
      try {
        const res = await fetch("/api/product", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = (await res.json()) as unknown;
        const arr = Array.isArray(data) ? (data as unknown[]) : [];
        const normalized: UIProduct[] = arr.map((raw) => {
          const obj = (raw ?? {}) as Record<string, unknown>;
          const _id =
            typeof obj._id === "string"
              ? obj._id
              : (
                  obj._id as { toString?: () => string } | undefined
                )?.toString?.() ?? "";
          const sellerId =
            typeof obj.sellerId === "string"
              ? obj.sellerId
              : (
                  obj.sellerId as { toString?: () => string } | undefined
                )?.toString?.() ?? "";
          const price =
            typeof obj.price === "number"
              ? obj.price
              : Number(obj.price ?? 0) || 0;
          const images = Array.isArray(obj.images)
            ? (obj.images as unknown[])
                .map((x) => (typeof x === "string" ? x : String(x)))
                .filter(Boolean)
            : [];
          const statusVal = obj.status;
          const status: UIProduct["status"] =
            statusVal === "sold" ||
            statusVal === "reserved" ||
            statusVal === "available"
              ? statusVal
              : "available";
          return {
            _id,
            name: (typeof obj.name === "string" ? obj.name : "") as string,
            price,
            images,
            sellerId,
            status,
            createdAt:
              typeof obj.createdAt === "string" || obj.createdAt instanceof Date
                ? (obj.createdAt as string | Date)
                : undefined,
            location:
              typeof obj.location === "string" ? obj.location : undefined,
          };
        });
        setProducts(normalized);
      } catch {
        toast.error("Couldn't fetch orders");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const mySales = useMemo(() => {
    if (!user?.id) return [] as UIProduct[];
    return products.filter(
      (p) =>
        p.sellerId === user.id &&
        (p.status === "reserved" || p.status === "sold")
    );
  }, [products, user?.id]);

  const stats = useMemo(() => {
    const sold = mySales.filter((p) => p.status === "sold");
    const reserved = mySales.filter((p) => p.status === "reserved");
    const revenue = sold.reduce((sum, p) => sum + (p.price || 0), 0);
    return { soldCount: sold.length, reservedCount: reserved.length, revenue };
  }, [mySales]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Header />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-20" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-lg" />
              <div className="h-4 bg-muted rounded w-2/3 mt-3" />
              <div className="h-4 bg-muted rounded w-1/3 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Receipt className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sign in to view orders</h1>
        <p className="text-muted-foreground mb-6">
          See orders for products you&apos;ve sold or reserved.
        </p>
        <Link href="/auth">
          <Button>Go to Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Sold
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.soldCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Reserved
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.reservedCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatCurrency(stats.revenue)}
          </CardContent>
        </Card>
      </div>

      {/* Orders list */}
      {mySales.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {mySales.map((p) => (
            <Card key={p._id} className="overflow-hidden">
              <div className="relative h-40 bg-muted">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <Package className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className={statusColor(p.status)}>{p.status}</Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">
                  {p.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{formatCurrency(p.price)}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(p.createdAt)}
                  </div>
                </div>
                {p.location ? (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {p.location}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
function Header() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm">
          Sales from products you&apos;ve posted
        </p>
      </div>
      <Link href="/my-products">
        <Button variant="outline">Manage products</Button>
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="mt-8">
      <CardContent className="py-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Receipt className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold mb-1">No orders yet</h2>
        <p className="text-muted-foreground mb-4">
          Orders will appear here when your products are reserved or sold.
        </p>
        <Link href="/seller">
          <Button>Post a product</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default OrderPage;
