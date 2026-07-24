import SvelteHost from './SvelteHost.svelte';

let app: SvelteHost | null = null;
let detachedLink: HTMLAnchorElement | null = null;
let showCount = 0;

function mount() {
  if (app) return;
  app = new SvelteHost({
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
  app?.$destroy();
  app = null;
}

function probeAfterUnmount() {
  if (!detachedLink) return false;
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  detachedLink.dispatchEvent(event);
  return event.defaultPrevented;
}

window.frameworkSmoke = {
  mount,
  unmount,
  probeAfterUnmount,
  getShowCount: () => showCount,
};

mount();
