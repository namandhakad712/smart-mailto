import {
  initSmartMailto,
  collectGeoSignals,
  detectRegionLabel,
  getAllProviders,
  type SmartMailtoConfig,
} from '@smart-mailto/core';

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

let currentTheme: 'dark' | 'light' | 'auto' = 'dark';
let destroy: (() => void) | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────────────────────

function initDemo() {
  const webmailProviders = getAllProviders().filter(
    provider => !provider.isNative && !provider.isCopy,
  );
  const providerCounts = {
    webmail: webmailProviders.length,
    compose: webmailProviders.filter(provider => !provider.fallbackOnly).length,
    fallback: webmailProviders.filter(provider => provider.fallbackOnly).length,
  };

  for (const [kind, count] of Object.entries(providerCounts)) {
    document.querySelectorAll<HTMLElement>(`[data-provider-count="${kind}"]`).forEach(element => {
      element.textContent = String(count);
    });
  }

  // Initialize smart-mailto
  destroy = initSmartMailto({
    theme: currentTheme,
    autoDetectGeo: true,
    includeCopy: true,
    maxProviders: 6,
    onOpen: (provider, params) => {
      console.log(`[smart-mailto] Opening ${provider.name} for ${params.to[0]}`);
    },
    onCopy: email => {
      console.log(`[smart-mailto] Copied: ${email}`);
    },
  });

  // Show geo info
  renderGeoInfo();

  // Render provider grid
  renderProviderGrid();

  // Render default code block
  showTab('vanilla');
}

// ─────────────────────────────────────────────────────────────────────────────
// Geo Info Display
// ─────────────────────────────────────────────────────────────────────────────

function renderGeoInfo() {
  const signals = collectGeoSignals();
  const region = detectRegionLabel(signals);
  const el = document.getElementById('geo-info');
  if (!el) return;

  el.innerHTML = `
    📍 <strong>Your detected region:</strong> ${region} &nbsp;·&nbsp;
    🕐 <strong>Timezone:</strong> ${signals.timeZone} &nbsp;·&nbsp;
    🌐 <strong>Locale:</strong> ${signals.locale}
    ${signals.isMobile ? ' &nbsp;·&nbsp; 📱 Mobile detected' : ''}
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Grid
// ─────────────────────────────────────────────────────────────────────────────

const REGIONS = [
  { flag: '🌍', name: 'Global', providers: 'Gmail, Outlook, Yahoo, ProtonMail, iCloud, Fastmail' },
  { flag: '🇷🇺', name: 'Russia / CIS', providers: 'Yandex Mail, Mail.ru' },
  { flag: '🇨🇳', name: 'China', providers: 'QQ Mail, 163 Mail' },
  { flag: '🇯🇵', name: 'Japan', providers: 'Yahoo! Japan Mail' },
  { flag: '🇰🇷', name: 'South Korea', providers: 'Naver Mail, Daum/Kakao' },
  { flag: '🇮🇳', name: 'India', providers: 'Gmail, Yahoo, Zoho, Rediffmail' },
  { flag: '🇩🇪', name: 'Germany / DACH', providers: 'GMX, WEB.DE, T-Online, Posteo, mailbox.org' },
  { flag: '🇫🇷', name: 'France', providers: 'Gmail, La Poste, Outlook' },
  { flag: '🇮🇹', name: 'Italy', providers: 'Libero Mail, Gmail' },
  { flag: '🇵🇱', name: 'Poland', providers: 'Onet Poczta, WP Poczta, Gmail' },
  { flag: '🇨🇿', name: 'Czech Republic', providers: 'Seznam Email, Gmail' },
  { flag: '🇺🇦', name: 'Ukraine', providers: 'Gmail, UKR.NET' },
  { flag: '🇧🇪', name: 'Belgium', providers: 'Gmail, Mailfence, Outlook' },
  { flag: '🇳🇴', name: 'Norway', providers: 'Runbox, Gmail, ProtonMail' },
  { flag: '🇦🇺', name: 'Australia', providers: 'Gmail, Fastmail, Outlook, iCloud' },
  { flag: '🇵🇭', name: 'Philippines', providers: 'Yahoo Mail, Gmail, Outlook' },
  { flag: '🇧🇷', name: 'Brazil / LATAM', providers: 'Gmail, Outlook, Yahoo' },
  { flag: '🇺🇸', name: 'USA / Canada', providers: 'Gmail, Outlook, Yahoo, iCloud' },
];

function renderProviderGrid() {
  const grid = document.getElementById('providers-grid');
  if (!grid) return;

  grid.innerHTML = REGIONS.map(
    r => `
    <div class="region-card">
      <div class="region-flag">${r.flag}</div>
      <div class="region-name">${r.name}</div>
      <div class="region-providers">${r.providers}</div>
    </div>
  `,
  ).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Code Tabs
// ─────────────────────────────────────────────────────────────────────────────

const CODE_SNIPPETS: Record<string, string> = {
  vanilla: `<span class="cmt">// Install</span>
npm install @smart-mailto/core

<span class="cmt">// One line of JavaScript:</span>
<span class="kw">import</span> { <span class="fn">initSmartMailto</span> } <span class="kw">from</span> <span class="str">'@smart-mailto/core'</span>;

<span class="fn">initSmartMailto</span>({
  theme: <span class="str">'dark'</span>,        <span class="cmt">// 'dark' | 'light' | 'auto'</span>
  autoDetectGeo: <span class="kw">true</span>,  <span class="cmt">// orders by user's region</span>
});

<span class="cmt">// That's it! All existing mailto: links just work:</span>
<span class="cmt">// &lt;a href="mailto:hello@example.com"&gt;Contact&lt;/a&gt;</span>`,

  react: `<span class="cmt">// Install</span>
npm install @smart-mailto/react

<span class="cmt">// Wrap your app (App.tsx or root layout):</span>
<span class="kw">import</span> { <span class="obj">SmartMailtoProvider</span> } <span class="kw">from</span> <span class="str">'@smart-mailto/react'</span>;

<span class="kw">export default function</span> <span class="fn">App</span>() {
  <span class="kw">return</span> (
    <span class="tag">&lt;SmartMailtoProvider</span> <span class="attr">theme</span>=<span class="str">"dark"</span> <span class="attr">autoDetectGeo</span><span class="tag">&gt;</span>
      <span class="tag">&lt;YourApp</span> <span class="tag">/&gt;</span>
    <span class="tag">&lt;/SmartMailtoProvider&gt;</span>
  );
}

<span class="cmt">// All existing mailto: links auto-intercepted ✅</span>
<span class="cmt">// &lt;a href="mailto:hello@example.com"&gt;Contact&lt;/a&gt;</span>`,

  vue: `<span class="cmt">// Install</span>
npm install @smart-mailto/vue

<span class="cmt">// main.ts:</span>
<span class="kw">import</span> { <span class="fn">createApp</span> } <span class="kw">from</span> <span class="str">'vue'</span>;
<span class="kw">import</span> { <span class="obj">SmartMailtoPlugin</span> } <span class="kw">from</span> <span class="str">'@smart-mailto/vue'</span>;
<span class="kw">import</span> <span class="obj">App</span> <span class="kw">from</span> <span class="str">'./App.vue'</span>;

<span class="fn">createApp</span>(<span class="obj">App</span>)
  .<span class="fn">use</span>(<span class="obj">SmartMailtoPlugin</span>, {
    theme: <span class="str">'dark'</span>,
    autoDetectGeo: <span class="kw">true</span>,
  })
  .<span class="fn">mount</span>(<span class="str">'#app'</span>);

<span class="cmt">// All &lt;a href="mailto:..."&gt; links auto-intercepted ✅</span>`,

  svelte: `<span class="cmt">// Install</span>
npm install @smart-mailto/svelte

<span class="cmt">// +layout.svelte (SvelteKit) or App.svelte:</span>
<span class="tag">&lt;script&gt;</span>
  <span class="kw">import</span> { <span class="fn">onMount</span>, <span class="fn">onDestroy</span> } <span class="kw">from</span> <span class="str">'svelte'</span>;
  <span class="kw">import</span> { <span class="fn">initGlobal</span> } <span class="kw">from</span> <span class="str">'@smart-mailto/svelte'</span>;

  <span class="kw">let</span> destroy;
  <span class="fn">onMount</span>(() => {
    destroy = <span class="fn">initGlobal</span>({ theme: <span class="str">'dark'</span>, autoDetectGeo: <span class="kw">true</span> });
  });
  <span class="fn">onDestroy</span>(() => <span class="fn">destroy</span>?.());
<span class="tag">&lt;/script&gt;</span>

<span class="tag">&lt;slot</span> <span class="tag">/&gt;</span>`,
};

(window as any).showTab = function (tab: string) {
  // Update tabs
  ['vanilla', 'react', 'vue', 'svelte'].forEach(t => {
    document.getElementById(`tab-${t}`)?.classList.toggle('active', t === tab);
  });

  // Update code
  const codeEl = document.getElementById('code-content');
  if (codeEl) {
    codeEl.innerHTML = CODE_SNIPPETS[tab] ?? '';
  }
};

(window as any).copyCode = async function () {
  const codeEl = document.getElementById('code-content');
  if (!codeEl) return;

  const text = codeEl.innerText;
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById('copy-btn') as HTMLButtonElement;
    if (btn) {
      btn.textContent = '✓ Copied!';
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, 2000);
    }
  } catch {
    // clipboard blocked
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Theme Switcher
// ─────────────────────────────────────────────────────────────────────────────

(window as any).setTheme = function (theme: 'dark' | 'light' | 'auto') {
  currentTheme = theme;

  // Re-init with new theme
  destroy?.();
  destroy = initSmartMailto({
    theme,
    autoDetectGeo: true,
    includeCopy: true,
    maxProviders: 6,
    onOpen: (provider, params) => {
      console.log(`[smart-mailto] Opening ${provider.name} for ${params.to[0]}`);
    },
  });

  // Update button states
  ['dark', 'light', 'auto'].forEach(t => {
    document.getElementById(`theme-${t}`)?.classList.toggle('active', t === theme);
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────────────────────────────

initDemo();
