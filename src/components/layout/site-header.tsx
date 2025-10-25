
import Link from 'next/link';
import { Button } from '../ui/button';
import { Logo } from '../logo';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/#listings"
              className="text-muted-foreground transition-colors hover:text-foreground/80"
            >
              Listings
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Button asChild>
                <Link href="/login">
                    Sign In
                </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
