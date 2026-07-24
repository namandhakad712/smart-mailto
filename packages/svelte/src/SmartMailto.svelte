<script>
  import { smartMailto } from './action.js';

  export let href;
  export let theme = undefined;
  export let autoDetectGeo = undefined;
  export let preferredProvider = undefined;
  export let maxProviders = undefined;
  export let includeNative = undefined;
  export let includeCopy = undefined;
  export let customProviders = undefined;
  export let excludeProviders = undefined;
  export let classNames = undefined;
  export let i18n = undefined;
  export let rememberChoice = undefined;
  export let storageKey = undefined;
  export let onOpen = undefined;
  export let onCopy = undefined;
  export let onClose = undefined;
  export let onShow = undefined;

  $: config = {
    theme,
    autoDetectGeo,
    preferredProvider,
    maxProviders,
    includeNative,
    includeCopy,
    customProviders,
    excludeProviders,
    classNames,
    i18n,
    rememberChoice,
    storageKey,
    onOpen,
    onCopy,
    onClose,
    onShow,
  };
</script>

<a {href} use:smartMailto={config} data-smart-mailto="true" {...$$restProps} on:click>
  <slot />
</a>
