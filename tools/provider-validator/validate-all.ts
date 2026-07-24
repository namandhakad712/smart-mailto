/**
 * Backward-compatible entry point for the comprehensive validator.
 *
 * The implementation now delegates to the same registry-derived validator used
 * by the active weekly workflow, so this command cannot drift to a second list.
 */

import { main } from './index.js';

main().catch(error => {
  console.error('Validator crashed:', error);
  process.exitCode = 1;
});
