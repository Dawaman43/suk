import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Sofa, Shirt, Book, Boxes } from "lucide-react";

const categories = [
  {
    key: "electronics",
    label: "Electronics",
    Icon: Laptop,
    color: "text-indigo-600",
  },
  {
    key: "furniture",
    label: "Furniture",
    Icon: Sofa,
    color: "text-emerald-600",
  },
  { key: "clothing", label: "Clothing", Icon: Shirt, color: "text-pink-600" },
  { key: "books", label: "Books", Icon: Book, color: "text-amber-600" },
  { key: "other", label: "Other", Icon: Boxes, color: "text-slate-600" },
];

export default function CategoriesSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Browse by category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(({ key, label, Icon, color }) => (
          <Card
            key={key}
            className="group cursor-pointer border-dashed hover:shadow-md transition-shadow"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={`rounded-lg bg-muted p-2 ${color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-medium">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
