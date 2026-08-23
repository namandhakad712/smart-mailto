/**
 * @smart-mailto/vue — Vue 3 Plugin
 *
 * Registers smart-mailto as a Vue plugin.
 *
 * @example
 * // main.ts
 * import { createApp } from 'vue';
 * import { SmartMailtoPlugin } from '@smart-mailto/vue';
 * import App from './App.vue';
 *
 * createApp(App)
 *   .use(SmartMailtoPlugin, { theme: 'dark', autoDetectGeo: true })
 *   .mount('#app');
 */

import { type App, type Plugin } from 'vue';
import { initSmartMailto, type SmartMailtoConfig } from '@smart-mailto/core';

/**
 * Vue plugin that initializes smart-mailto globally.
 * Cleans up when the Vue app is unmounted.
 */
export const SmartMailtoPlugin: Plugin<SmartMailtoConfig> = {
  install(app: App, config: SmartMailtoConfig = {}) {
    // Initialize global event delegation
    const destroy = initSmartMailto(config);

    // Provide config to all child components via inject
    app.provide('smartMailtoConfig', config);

    // Clean up when app unmounts
    app.config.globalProperties.$smartMailtoDestroy = destroy;
    const unmount = app.unmount.bind(app);
    let destroyed = false;
    app.unmount = () => {
      if (!destroyed) {
        destroy();
        destroyed = true;
      }
      unmount();
    };

    // Register global component
    app.component('SmartMailto', SmartMailtoComponent);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Inline Component (no .vue file needed)
// ─────────────────────────────────────────────────────────────────────────────

import { h, inject, defineComponent, type PropType } from 'vue';
import {
  parseMailto,
  isValidMailtoParams,
  resolveProviders,
  openRememberedProvider,
  spawnModal,
} from '@smart-mailto/core';

/**
 * SmartMailto Vue component.
 *
 * @example
 * <SmartMailto href="mailto:hello@example.com" theme="dark">
 *   Contact Us
 * </SmartMailto>
 *
 * @example (without plugin — self-contained)
 * import { SmartMailtoComponent } from '@smart-mailto/vue';
 */
export const SmartMailtoComponent = defineComponent({
  name: 'SmartMailto',
  props: {
    href: {
      type: String,
      required: true,
    },
    theme: {
      type: String as PropType<'dark' | 'light' | 'auto'>,
      default: undefined,
    },
    autoDetectGeo: {
      type: Boolean,
      default: true,
    },
    preferredProvider: {
      type: String,
      default: undefined,
    },
    maxProviders: {
      type: Number,
      default: 6,
    },
    includeNative: {
      type: Boolean,
      default: undefined,
    },
    includeCopy: {
      type: Boolean,
      default: true,
    },
    rememberChoice: {
      type: Boolean,
      default: undefined,
    },
    skipPickerOnRememberedChoice: {
      type: Boolean,
      default: undefined,
    },
    storageKey: {
      type: String,
      default: undefined,
    },
  },
  emits: ['open', 'copy', 'close'],
  setup(props, { slots, emit }) {
    const globalConfig = inject<SmartMailtoConfig>('smartMailtoConfig', {});

    const handleClick = (e: MouseEvent) => {
      const params = parseMailto(props.href);

      if (!isValidMailtoParams(params)) return;

      e.preventDefault();
      e.stopPropagation();

      const config: SmartMailtoConfig = {
        ...globalConfig,
        theme: props.theme,
        autoDetectGeo: props.autoDetectGeo,
        preferredProvider: props.preferredProvider,
        maxProviders: props.maxProviders,
        includeNative: props.includeNative,
        includeCopy: props.includeCopy,
        rememberChoice: props.rememberChoice,
        skipPickerOnRememberedChoice: props.skipPickerOnRememberedChoice,
        storageKey: props.storageKey,
        onOpen: (provider, params) => emit('open', provider, params),
        onCopy: email => emit('copy', email),
        onClose: () => emit('close'),
      };

      const resolved = resolveProviders(params, config);
      const forcePicker = (e.currentTarget as HTMLElement | null)?.hasAttribute(
        'data-smart-mailto-force-picker',
      );
      if (!forcePicker && openRememberedProvider(params, resolved, config)) return;

      config.onShow?.(params, resolved.providers);
      spawnModal(params, resolved, config);
    };

    return () =>
      h(
        'a',
        {
          href: props.href,
          onClick: handleClick,
          'data-smart-mailto': 'true',
        },
        slots.default?.(),
      );
  },
});
