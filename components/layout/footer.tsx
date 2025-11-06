import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-base font-semibold mb-3">Suq</h3>
          <p className="text-muted-foreground">
            Youth-powered B2B marketplace. Zero fees. Endless growth.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/seller">Sell</Link>
            </li>
            <li>
              <Link href="/my-products">My products</Link>
            </li>
            <li>
              <Link href="/order">Orders</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Follow</h4>
          <div className="flex gap-3 text-muted-foreground">
            <a href="#" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Suq. All rights reserved.
      </div>
    </footer>
  );
}
