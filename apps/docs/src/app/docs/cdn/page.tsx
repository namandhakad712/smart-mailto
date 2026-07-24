import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CDN / Vanilla JS — smart-mailto',
  description:
    'Use smart-mailto from a CDN via UMD bundle. No build tools required — just a script tag.',
};

function CodeBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden border border-border bg-code-bg dark:border-border">
      <div className="border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
        {label}
      </div>
      <pre className="p-5 text-sm leading-7 text-white">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-headline font-normal text-ink dark:text-text border-b border-border dark:border-border pb-3 mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CdnPage() {
  return (
    <article className="mx-auto max-w-6xl">
      <header className="border-b border-border pb-12 dark:border-border mb-12">
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red">
          Guide · CDN & Vanilla JavaScript
        </p>
        <h1 className="max-w-4xl text-balance font-headline text-5xl font-normal leading-[1.05] tracking-tight text-ink dark:text-text md:text-7xl">
          CDN Usage
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft dark:text-text-soft">
          smart-mailto ships a UMD bundle for use directly from a CDN. No bundler, no framework, no
          build step required — just add a script tag.
        </p>
      </header>

      <div className="space-y-16">
        <Section id="quick-start" title="Quick Start">
          <p className="text-sm text-ink-soft dark:text-text-soft mb-4">
            Add the script to your HTML, then call{' '}
            <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1">
              initSmartMailto()
            </code>{' '}
            to enable the global mailto: interceptor:
          </p>
          <CodeBlock label="index.html">
            {`<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://cdn.jsdelivr.net/npm/@smart-mailto/core@latest/dist/smart-mailto.umd.js"></script>
</head>
<body>
  <a href="mailto:hello@example.com">Contact us</a>
  <script>
    SmartMailto.initSmartMailto({
      theme: 'auto',
      autoDetectGeo: true,
    });
  </script>
</body>
</html>`}
          </CodeBlock>
        </Section>

        <Section id="available-formats" title="Available Formats">
          <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
            All three formats are published to npm and available on CDNs:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-2">ESM</h3>
              <p className="font-mono text-[10px] text-ink-muted dark:text-text-muted mb-2">
                Modern bundlers (webpack, Vite, Rollup)
              </p>
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1 py-0.5">
                @smart-mailto/core
              </code>
            </div>
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-2">CJS</h3>
              <p className="font-mono text-[10px] text-ink-muted dark:text-text-muted mb-2">
                Node.js / CommonJS environments
              </p>
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1 py-0.5">
                require(&apos;@smart-mailto/core&apos;)
              </code>
            </div>
            <div className="p-5 border border-border dark:border-border">
              <h3 className="font-mono text-xs text-red mb-2">UMD</h3>
              <p className="font-mono text-[10px] text-ink-muted dark:text-text-muted mb-2">
                Script tags, AMD, no-bundler setups
              </p>
              <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1 py-0.5">
                SmartMailto.initSmartMailto()
              </code>
            </div>
          </div>
        </Section>

        <Section id="cdn-urls" title="CDN URLs">
          <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
            All major CDNs serve the UMD bundle:
          </p>
          <div className="space-y-3">
            {[
              {
                name: 'jsDelivr',
                url: 'https://cdn.jsdelivr.net/npm/@smart-mailto/core/dist/smart-mailto.umd.js',
              },
              {
                name: 'unpkg',
                url: 'https://unpkg.com/@smart-mailto/core/dist/smart-mailto.umd.js',
              },
              {
                name: 'cdnjs',
                url: 'https://cdnjs.cloudflare.com/ajax/libs/smart-mailto/0.2.0/smart-mailto.umd.js',
              },
            ].map(cdn => (
              <div key={cdn.name} className="p-3 border border-border dark:border-border">
                <span className="font-mono text-xs text-red mr-3">{cdn.name}</span>
                <code className="text-[10px] font-mono text-ink-muted dark:text-text-muted break-all">
                  {cdn.url}
                </code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="framework-wrappers" title="Framework Wrappers">
          <p className="text-sm text-ink-soft dark:text-text-soft mb-6">
            For framework projects, install the corresponding package from npm:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                pkg: '@smart-mailto/react',
                cmd: 'npm install @smart-mailto/react',
                desc: 'React 17+',
              },
              { pkg: '@smart-mailto/vue', cmd: 'npm install @smart-mailto/vue', desc: 'Vue 3+' },
              {
                pkg: '@smart-mailto/svelte',
                cmd: 'npm install @smart-mailto/svelte',
                desc: 'Svelte 4+',
              },
            ].map(fw => (
              <div key={fw.pkg} className="p-5 border border-border dark:border-border">
                <h3 className="font-mono text-xs text-red mb-1">{fw.desc}</h3>
                <code className="text-[10px] font-mono bg-surface dark:bg-surface-container px-1 py-0.5">
                  {fw.cmd}
                </code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="esm-import-map" title="Using ESM from CDN">
          <p className="text-sm text-ink-soft dark:text-text-soft mb-4">
            For modern browsers that support import maps, use the ESM build directly:
          </p>
          <CodeBlock label="esm-with-importmap">
            {`<script type="importmap">
{
  "imports": {
    "@smart-mailto/core": "https://cdn.jsdelivr.net/npm/@smart-mailto/core@latest/dist/index.js"
  }
}
</script>
<script type="module">
import { initSmartMailto } from '@smart-mailto/core';
initSmartMailto({ theme: 'auto' });
</script>`}
          </CodeBlock>
        </Section>
      </div>
    </article>
  );
}
