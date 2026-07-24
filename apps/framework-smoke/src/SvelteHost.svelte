<script>
  import { smartMailto } from '@smart-mailto/svelte';

  export let onShow;
</script>

<a
  id="contact"
  href="mailto:svelte@example.com?subject=Framework%20smoke"
  use:smartMailto={{ autoDetectGeo: false, maxProviders: 2, onShow }}
>
  Contact from Svelte
</a>
