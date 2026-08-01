import { mount, unmount as unmountComponent, type Component } from 'svelte';
import SvelteHost from './SvelteHost.svelte';
import { destroyGlobal, initGlobal, smartMailto } from '@smart-mailto/svelte';

let app: ReturnType<Component<Record<string, unknown>>> | null = null;
let detachedLink: HTMLAnchorElement | null = null;
let showCount = 0;

function mountHost() {
  if (app) return;
  app = mount(SvelteHost, {
    target: document.getElementById('root')!,
    props: {
      onShow: () => {
        showCount += 1;
      },
    },
  });
}

function unmount() {
  detachedLink = document.querySelector<HTMLAnchorElement>('#contact');
  if (app) {
    unmountComponent(app);
    app = null;
  }
}

function probeAfterUnmount() {
  if (!detachedLink) return false;
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  detachedLink.dispatchEvent(event);
  return event.defaultPrevented;
}

window.frameworkSmoke = {
  mount: mountHost,
  unmount,
  probeAfterUnmount,
  getShowCount: () => showCount,
  getLegacyExports: () =>
    [destroyGlobal, initGlobal, smartMailto].every(value => typeof value === 'function'),
};

mountHost();
