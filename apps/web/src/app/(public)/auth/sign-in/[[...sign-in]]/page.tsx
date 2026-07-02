import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-background/95">
      {/* Back to Home */}
      <div className="pt-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-base">&lt;/&gt;</span>
              </div>
              <h1 className="text-2xl font-bold">EDITO</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Sign in to your collaborative coding workspace
            </p>
          </div>

          {/* Auth Component */}
          <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 sm:p-8 shadow-lg">
            <SignIn
              signUpUrl="/auth/sign-up"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-accent hover:bg-accent/90 text-accent-foreground',
                  card: 'bg-transparent shadow-none',
                  socialButtonsBlockButton: 'border-border hover:bg-background/50',
                },
              }}
            />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="text-accent hover:text-accent/80 font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
