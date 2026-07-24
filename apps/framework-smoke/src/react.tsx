import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { SmartMailtoProvider } from '@smart-mailto/react';

let root: Root | null = null;
let showCount = 0;

function App() {
  return (
    <SmartMailtoProvider
      autoDetectGeo={false}
      maxProviders={2}
      onShow={() => {
        showCount += 1;
      }}
    >
      <a id="contact" href="mailto:react@example.com?subject=Framework%20smoke">
        Contact from React
      </a>
    </SmartMailtoProvider>
  );
}

function mount() {
  if (root) return;
  root = createRoot(document.getElementById('root')!);
  root.render(<App />);
}

function unmount() {
  root?.unmount();
  root = null;
}

function probeAfterUnmount() {
  const link = document.createElement('a');
  link.href = 'mailto:cleanup@example.com';
  document.body.appendChild(link);
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  link.dispatchEvent(event);
  link.remove();
  return event.defaultPrevented;
}

window.frameworkSmoke = {
  mount,
  unmount,
  probeAfterUnmount,
  getShowCount: () => showCount,
};

mount();
