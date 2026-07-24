interface FrameworkSmokeApi {
  mount(): void;
  unmount(): void;
  probeAfterUnmount(): boolean;
  getShowCount(): number;
  getLegacyExports?(): boolean;
}

interface Window {
  frameworkSmoke: FrameworkSmokeApi;
}

declare module '*.svelte' {
  import type { SvelteComponent } from 'svelte';

  export default class Component extends SvelteComponent {}
}
