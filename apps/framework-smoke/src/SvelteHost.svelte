<script>
  import { SmartMailto } from '@smart-mailto/svelte';

  export let onShow;
</script>

<SmartMailto
  id="contact"
  href="mailto:svelte@example.com?subject=Framework%20smoke"
  autoDetectGeo={false}
  maxProviders={2}
  {onShow}
>
  Contact from Svelte
</SmartMailto>
