const fs = require('fs');
let c = fs.readFileSync('packages/core/src/providers.ts', 'utf8');
c = c.replace(/\n\s+logoSvg: ICONS\.[a-zA-Z_]+,/g, '');
c = c.replace(
  /\/\/ ───+[\s\S]+?SVG Icons[\s\S]+?export const PROVIDERS/g,
  'export const PROVIDERS',
);
fs.writeFileSync('packages/core/src/providers.ts', c);
