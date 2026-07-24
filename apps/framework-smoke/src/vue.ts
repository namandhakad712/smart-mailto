import { createApp, defineComponent, h, type App } from 'vue';
import { SmartMailtoPlugin } from '@smart-mailto/vue';

let app: App<Element> | null = null;
let showCount = 0;

const Host = defineComponent({
  name: 'FrameworkSmokeHost',
  setup() {
    return () =>
      h(
        'a',
        {
          id: 'contact',
          href: 'mailto:vue@example.com?subject=Framework%20smoke',
        },
        'Contact from Vue',
      );
  },
});

function mount() {
  if (app) return;
  app = createApp(Host);
  app.use(SmartMailtoPlugin, {
    autoDetectGeo: false,
    maxProviders: 2,
    onShow: () => {
      showCount += 1;
    },
  });
  app.mount('#root');
}

function unmount() {
  app?.unmount();
  app = null;
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
