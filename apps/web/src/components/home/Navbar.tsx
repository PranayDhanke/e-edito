"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { Code2, LayoutDashboard, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-85"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl border border-amber-200/70 bg-[linear-gradient(135deg,#f59e0b,#fb7185)] text-white shadow-[0_16px_40px_-20px_rgba(245,158,11,0.8)]">
            <Code2 className="size-5" />
          </span>
          <div>
            <p className="font-heading text-xl font-semibold tracking-[0.18em] uppercase">
              Edito
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Collaborative coding rooms
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {isSignedIn ? (
            <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/create-room">
                <Plus className="size-4" />
                New Room
              </Link>
            </Button>
            <div className="ml-2">
              <UserButton />
            </div>
            </>
          ) : null}

          {!isSignedIn ? (
            <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">
                <Sparkles className="size-4" />
                Start Free
              </Button>
            </SignUpButton>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
