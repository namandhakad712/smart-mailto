interface FrameworkSmokeApi {
  mount(): void;
  unmount(): void;
  probeAfterUnmount(): boolean;
  getShowCount(): number;
}

interface Window {
  frameworkSmoke: FrameworkSmokeApi;
}

declare module '*.svelte' {
  import type { SvelteComponent } from 'svelte';

  export default class Component extends SvelteComponent {}
}
