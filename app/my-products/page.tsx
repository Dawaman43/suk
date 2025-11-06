"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarDays,
  MoreHorizontal,
  Package,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type UIProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  sellerId: string;
  status: "available" | "sold" | "reserved";
  createdAt?: string | Date;
  updatedAt?: string | Date;
  category?: string;
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
    case "available":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "reserved":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "sold":
      return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
}

export default function MyProductPage() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UIProduct["status"]>(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price-asc" | "price-desc" | "name"
  >("newest");

  // Edit sheet state
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<UIProduct | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    price: string;
    description: string;
    category: string;
    location: string;
    status: UIProduct["status"];
  }>({
    name: "",
    price: "0",
    description: "",
    category: "",
    location: "",
    status: "available",
  });

  useEffect(() => {
    const init = async () => {
      try {
        const session = await getSession();
        const u = session.data?.user as SessionUser | undefined;
        setSessionUser(u ?? null);
      } catch {
        // no-op
      } finally {
        // continue to fetch regardless; page can show CTA to sign in
      }

      try {
        const res = await fetch("/api/product", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const data = (await res.json()) as unknown;
        // Normalize ids and dates to strings for the client
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
            description:
              typeof obj.description === "string" ? obj.description : undefined,
            price,
            images,
            sellerId,
            status,
            createdAt:
              typeof obj.createdAt === "string" || obj.createdAt instanceof Date
                ? (obj.createdAt as string | Date)
                : undefined,
            updatedAt:
              typeof obj.updatedAt === "string" || obj.updatedAt instanceof Date
                ? (obj.updatedAt as string | Date)
                : undefined,
            category:
              typeof obj.category === "string" ? obj.category : undefined,
            location:
              typeof obj.location === "string" ? obj.location : undefined,
          };
        });
        setAllProducts(normalized);
      } catch {
        toast.error("Couldn't fetch products");
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  const myProducts = useMemo(() => {
    if (!sessionUser?.id) return [] as UIProduct[];
    return allProducts.filter((p) => p.sellerId === sessionUser.id);
  }, [allProducts, sessionUser?.id]);

  const filteredSorted = useMemo(() => {
    let list = myProducts;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }
    const sortCopy = [...list];
    sortCopy.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "oldest": {
          const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return ad - bd;
        }
        case "newest":
        default: {
          const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bd - ad;
        }
      }
    });
    return sortCopy;
  }, [myProducts, query, statusFilter, sortBy]);

  const mutateOne = (id: string, updates: Partial<UIProduct>) => {
    setAllProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updates } : p))
    );
  };

  const onChangeStatus = async (id: string, status: UIProduct["status"]) => {
    setUpdatingIds((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      mutateOne(id, { status });
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingIds((s) => ({ ...s, [id]: false }));
    }
  };

  const onDelete = async (id: string) => {
    const confirm = window.confirm(
      "Delete this product? This cannot be undone."
    );
    if (!confirm) return;
    setUpdatingIds((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/product/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAllProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setUpdatingIds((s) => ({ ...s, [id]: false }));
    }
  };

  const openEdit = (p: UIProduct) => {
    setEditProduct(p);
    setEditForm({
      name: p.name ?? "",
      price: String(p.price ?? 0),
      description: p.description ?? "",
      category: p.category ?? "",
      location: p.location ?? "",
      status: p.status,
    });
    setEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editProduct) return;
    const id = editProduct._id;
    const updates: Partial<UIProduct> = {
      name: editForm.name.trim(),
      price: Number(editForm.price) || 0,
      description: editForm.description.trim(),
      category: editForm.category.trim() || undefined,
      location: editForm.location.trim() || undefined,
      status: editForm.status,
    };
    setUpdatingIds((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      mutateOne(id, updates);
      toast.success("Product updated");
      setEditOpen(false);
      setEditProduct(null);
    } catch {
      toast.error("Failed to update product");
    } finally {
      setUpdatingIds((s) => ({ ...s, [id]: false }));
    }
  };

  // UI STATES
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Header count={undefined} />
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

  if (!sessionUser?.id) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Package className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          Sign in to view your products
        </h1>
        <p className="text-muted-foreground mb-6">
          Track, update, and manage the products you&apos;ve posted.
        </p>
        <Link href="/auth">
          <Button>Go to Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header count={myProducts.length} />

      {/* Toolbar */}
      <Card className="mt-4">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as typeof sortBy)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredSorted.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredSorted.map((p) => (
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
                {p.category ? (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="capitalize">
                      {p.category}
                    </Badge>
                  </div>
                ) : null}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">
                  {p.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 pb-4">
                <div>
                  <div className="font-semibold">{formatCurrency(p.price)}</div>
                  {p.location ? (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {p.location}
                    </div>
                  ) : null}
                  {p.createdAt ? (
                    <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(p.createdAt)}
                    </div>
                  ) : null}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!!updatingIds[p._id]}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onChangeStatus(p._id, "available")}
                    >
                      Mark available
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onChangeStatus(p._id, "reserved")}
                    >
                      Mark reserved
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onChangeStatus(p._id, "sold")}
                    >
                      Mark sold
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(p._id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={(o) => setEditOpen(o)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit product</SheetTitle>
          </SheetHeader>
          <div className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, price: e.target.value }))
                }
                min={0}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="Category"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={editForm.location}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="City, State"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(v) =>
                  setEditForm((f) => ({
                    ...f,
                    status: v as UIProduct["status"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={submitEdit}
                disabled={!editProduct || updatingIds[editProduct._id] === true}
              >
                Save changes
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Header({ count }: { count: number | undefined }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">My Products</h1>
        <p className="text-muted-foreground text-sm">
          {typeof count === "number"
            ? `${count} item${count === 1 ? "" : "s"}`
            : "Loading..."}
        </p>
      </div>
      <Link href="/seller">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" /> Post new
        </Button>
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="mt-8">
      <CardContent className="py-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Package className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold mb-1">No products yet</h2>
        <p className="text-muted-foreground mb-4">
          Start by posting your first product.
        </p>
        <Link href="/seller">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" /> Sell a product
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function formatDate(d: string | Date) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
