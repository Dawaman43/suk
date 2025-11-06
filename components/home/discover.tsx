"use client";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Sparkles, Star, TrendingUp } from "lucide-react";

type UIProduct = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  sellerId: string;
  status: "available" | "sold" | "reserved";
  createdAt?: string | Date;
  category?: string;
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

function ProductCard({ p }: { p: UIProduct }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
        {p.category ? (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="capitalize">
              {p.category}
            </Badge>
          </div>
        ) : null}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base line-clamp-1">{p.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="font-semibold">{formatCurrency(p.price)}</div>
      </CardContent>
    </Card>
  );
}

export default function DiscoverSection() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<UIProduct[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/product", { cache: "no-store" });
        if (!res.ok) throw new Error();
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
            category:
              typeof obj.category === "string" ? obj.category : undefined,
          };
        });
        setProducts(normalized);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const newArrivals = useMemo(() => {
    const list = [...products];
    list.sort((a, b) => {
      const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bd - ad;
    });
    return list.slice(0, 6);
  }, [products]);

  const topRanked = useMemo(() => {
    const available = products.filter((p) => p.status === "available");
    available.sort((a, b) => b.price - a.price);
    return available.slice(0, 6);
  }, [products]);

  const topSellers = useMemo(() => {
    const soldOrReserved = products.filter(
      (p) => p.status === "sold" || p.status === "reserved"
    );
    soldOrReserved.sort((a, b) => {
      const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bd - ad;
    });
    return soldOrReserved.slice(0, 6);
  }, [products]);

  return (
    <>
      {/* Full-bleed header */}
      <div className="relative mx-[calc(50%-50vw)] bg-linear-to-r from-indigo-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Hand-picked picks</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Discover your interest
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Explore top-ranked deals, fresh arrivals, and what&apos;s trending
            from our community.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="top" className="w-full">
          <TabsList className="w-full h-11 justify-between">
            <TabsTrigger value="top" className="gap-2 text-sm md:text-base">
              <Star className="h-4 w-4" /> Top ranked
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2 text-sm md:text-base">
              <TrendingUp className="h-4 w-4" /> New arrivals
            </TabsTrigger>
            <TabsTrigger value="sellers" className="gap-2 text-sm md:text-base">
              <Package className="h-4 w-4" /> Top sellers
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="top">
              <Grid loading={loading} items={topRanked} />
            </TabsContent>
            <TabsContent value="new">
              <Grid loading={loading} items={newArrivals} />
            </TabsContent>
            <TabsContent value="sellers">
              <Grid loading={loading} items={topSellers} />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </>
  );
}

function Grid({ loading, items }: { loading: boolean; items: UIProduct[] }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 bg-muted rounded-lg" />
            <div className="h-4 bg-muted rounded w-2/3 mt-3" />
            <div className="h-4 bg-muted rounded w-1/3 mt-2" />
          </div>
        ))}
      </div>
    );
  }
  if (!items.length) {
    return (
      <div className="text-sm text-muted-foreground">No items to show.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => (
        <div
          key={p._id}
          className="group transition-transform will-change-transform hover:-translate-y-0.5"
        >
          <ProductCard p={p} />
        </div>
      ))}
    </div>
  );
}

// default export is defined above
