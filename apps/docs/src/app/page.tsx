import { Demo } from '@/components/Demo';
import { ProviderTable } from '@/components/ProviderTable';

const GithubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ZapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-blue-400 mb-6"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const Globe2Icon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-purple-400 mb-6"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
    <path d="M2 12h20"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-emerald-400 mb-6"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md"></div>
            smart-mailto
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#providers" className="hover:text-white transition-colors">
              Providers
            </a>
            <a
              href="https://github.com/naman/smart-mailto"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
            >
              <GithubIcon />
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 overflow-hidden">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0.0 is now live
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
            Stop breaking <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600">
              email links.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-medium">
            A framework-agnostic, zero-dependency library that intelligently intercepts mailto links
            and routes users to their preferred webmail.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <code className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl font-mono text-sm text-zinc-300 flex items-center">
              <span className="text-blue-400 mr-2">$</span> pnpm add @smart-mailto/react
            </code>
          </div>
        </div>

        {/* Live Demo */}
        <Demo />

        {/* Features Grid */}
        <div
          id="features"
          className="max-w-6xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
            <ZapIcon />
            <h3 className="text-xl font-bold mb-3">Zero Dependencies</h3>
            <p className="text-zinc-400 leading-relaxed">
              Built in Vanilla TypeScript. Extremely lightweight at under 8KB gzipped. Doesn't
              pollute your bundle.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
            <Globe2Icon />
            <h3 className="text-xl font-bold mb-3">Geo-Aware</h3>
            <p className="text-zinc-400 leading-relaxed">
              Intelligently suggests providers based on the user's locale without making a single
              IP/network request.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
            <ShieldIcon />
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-zinc-400 leading-relaxed">
              Everything runs locally in the browser. No tracking, no external pings. Fully GDPR
              compliant by default.
            </p>
          </div>
        </div>

        {/* Provider Table */}
        <div id="providers">
          <ProviderTable />
        </div>
      </main>

      <footer className="border-t border-white/10 bg-black/50 py-12 text-center text-zinc-500">
        <p>Built with precision. Designed for the world.</p>
        <p className="mt-2 text-sm">MIT Licensed forever. We are going to change history.</p>
      </footer>
    </div>
  );
}
