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
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">&lt;/&gt;</span>
          </div>
          <span className="font-semibold text-base hidden sm:inline">EDITO</span>
        </Link>

        <nav className="flex items-center gap-1.5 ml-auto">
          {isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild className="gap-1.5">
                <Link href="/dashboard">
                  <LayoutDashboard className="size-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              <Button size="sm" asChild className="gap-1.5">
                <Link href="/dashboard/create-room">
                  <Plus className="size-3.5" />
                  <span className="hidden sm:inline">Room</span>
                </Link>
              </Button>
              <div className="ml-1 pl-1 border-l border-border/30">
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="gap-1.5">
                  <Sparkles className="size-3.5" />
                  Start Free
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
