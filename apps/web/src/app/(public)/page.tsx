import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import {
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { ArrowRight, Code2, Mic, ShieldCheck, Users, Video } from "lucide-react";
import Link from "next/link";

const featureCards = [
  {
    icon: Users,
    title: "Live collaboration",
    description:
      "Invite teammates into the same room and keep everyone aligned on one shared codebase.",
  },
  {
    icon: ShieldCheck,
    title: "Room permissions",
    description:
      "Choose who can join, who can edit, and how open or private each workspace should be.",
  },
  {
    icon: Mic,
    title: "Built for sessions",
    description:
      "Pair coding, mock interviews, and guided reviews feel more natural with audio and video controls.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_30%),linear-gradient(180deg,rgba(255,251,235,0.85),rgba(255,255,255,0))]" />

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
              <Code2 className="size-3.5" />
              Fast collaborative workspaces
            </div>

            <h1 className="mt-6 font-heading text-5xl font-semibold leading-none text-foreground sm:text-6xl lg:text-7xl">
              Rooms that make coding together feel focused.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Edito gives your team a polished place to pair program, review
              ideas, and run interviews without the friction of scattered tools
              and rough handoffs.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {!userId ? (
                <>
                <SignUpButton mode="modal">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start building
                    <ArrowRight className="size-4" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Sign in
                  </Button>
                </SignInButton>
                </>
              ) : null}

              {userId ? (
                <>
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/dashboard/create-room">Create a room</Link>
                </Button>
                </>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-12 hidden h-24 w-24 rounded-full bg-amber-200/40 blur-2xl md:block" />
            <div className="absolute -right-4 bottom-8 hidden h-28 w-28 rounded-full bg-sky-200/40 blur-2xl md:block" />

            <div className="relative rounded-[2rem] border border-border/60 bg-white/85 p-5 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
              <div className="rounded-[1.5rem] border border-slate-900/85 bg-slate-950 p-5 text-slate-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Active room
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Frontend Pairing Session
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    live
                  </span>
                </div>

                <div className="mt-5 space-y-3 font-mono text-sm text-slate-300">
                  <div className="rounded-2xl bg-slate-900 px-4 py-3 text-slate-400">
                    <span className="mr-3 text-slate-600">1</span>
                    const room = createWorkspace({"{"}
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <span className="mr-3 text-slate-600">2</span>
                    participants: 4,
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <span className="mr-3 text-slate-600">3</span>
                    language: &quot;typescript&quot;,
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <span className="mr-3 text-slate-600">4</span>
                    mode: &quot;interview&quot;,
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-4 py-3 text-slate-400">
                    <span className="mr-3 text-slate-600">5</span>
                    {"});"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Members
                    </p>
                    <p className="mt-2 text-2xl font-semibold">04</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Audio
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-emerald-300">
                      <Mic className="size-4" />
                      On
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Video
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sky-300">
                      <Video className="size-4" />
                      Optional
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[1.75rem] border border-border/60 bg-card/75 p-6 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(14,165,233,0.12))] text-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
