import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">
              Ready to grow with zero fees?
            </h3>
            <p className="text-white/80">
              Join Suq today and reach buyers across the community.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/seller">
              <Button className="bg-white text-indigo-700 hover:bg-white/90">
                List a product
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="outline"
                className="bg-transparent text-white border-white/40 hover:bg-white/10"
              >
                Sign in <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
