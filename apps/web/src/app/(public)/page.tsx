import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import {
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { ArrowRight, Code2, Zap, Shield, Users, Play } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Code2,
    title: "Real-time Collaboration",
    description:
      "Code together with instant syncing. See changes as your teammates type, with live presence indicators.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized for speed. Sub-100ms latency with efficient diff algorithms ensures smooth collaborative editing.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Control access with granular permissions. End-to-end encrypted rooms with role-based access control.",
  },
  {
    icon: Users,
    title: "Built for Teams",
    description:
      "Perfect for pair programming, code reviews, interviews, and team sessions with integrated audio/video.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="relative overflow-hidden bg-black text-white">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-black to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/5 px-4 py-2 mb-6">
            <Code2 className="size-3.5 text-orange-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Professional Collaborative Coding
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            Code{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              together
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            EDITO brings teams together with a professional IDE experience. Pair program, review code, 
            and conduct interviews with real-time collaboration, integrated communication, and zero friction.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            {!userId ? (
              <>
                <SignUpButton mode="modal">
                  <Button size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
                    Start Free
                    <ArrowRight className="size-4" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-600 hover:bg-gray-900">
                    Sign In
                  </Button>
                </SignInButton>
              </>
            ) : (
              <>
                <Button size="lg" asChild className="gap-2 bg-orange-600 hover:bg-orange-700">
                  <Link href="/dashboard">
                    Open Dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/dashboard/create-room">Create a room</Link>
                </Button>
                </>
              )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-16 py-8 border-t border-b border-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">10K+</div>
              <div className="text-xs text-gray-400 mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">&lt;100ms</div>
              <div className="text-xs text-gray-400 mt-1">Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">99.9%</div>
              <div className="text-xs text-gray-400 mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Built for professional developers who care about speed, reliability, and collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-gray-800 bg-gray-900/40 p-8 hover:border-orange-500/30 transition-colors"
              >
                <Icon className="size-6 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-900/20 to-transparent p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to collaborate smarter?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Start coding together in seconds. No credit card required.
          </p>
          {!userId ? (
            <SignUpButton mode="modal">
              <Button size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700">
                Create Your First Room
                <ArrowRight className="size-4" />
              </Button>
            </SignUpButton>
          ) : (
            <Button size="lg" asChild className="gap-2 bg-orange-600 hover:bg-orange-700">
              <Link href="/dashboard/create-room">
                Create Your First Room
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">&lt;/&gt;</span>
                </div>
                <span className="font-semibold">EDITO</span>
              </div>
              <p className="text-sm text-gray-400">
                Professional collaborative coding platform for teams.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-sm mb-3">Product</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-sm mb-3">Company</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-gray-400 text-center">
            <p>© {new Date().getFullYear()} EDITO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
