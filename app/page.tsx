import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 font-sans text-zinc-100 overflow-hidden relative">
      {/* Background blobs for aesthetics */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-zinc-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <header className="fixed top-0 z-10 w-full border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20"></div>
            <span className="text-xl font-bold tracking-tight text-white">RCWings</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-zinc-200 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-1 px-6 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-blue-400 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: Step 3 is live
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white mb-6">
          Your projects, <br />
          <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
            accelerated.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate project management platform for high-performance teams.
          Streamline your workflow, track progress, and build faster than ever.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-xl border border-zinc-800 bg-zinc-900/50 px-10 py-4 text-lg font-bold text-white hover:bg-zinc-800 transition-all hover:-translate-y-1"
          >
            Vew Demo
          </Link>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full px-6 py-6 text-center text-sm text-zinc-600">
        © 2026 RCWings. Built with passion.
      </footer>
    </div>
  );
}
