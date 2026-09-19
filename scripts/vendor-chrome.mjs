/**
 * Copy Twiddle chrome CSS from the product repo.
 * Usage: node scripts/vendor-chrome.mjs [path-to-spec-lens]
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const srcRoot = resolve(process.argv[2] ?? '../Knowledge Base/projects/spec-lens');
const dest = resolve('vendor/chrome');

mkdirSync(resolve(dest, 'tokens'), { recursive: true });
copyFileSync(resolve(srcRoot, 'src/tokens.css'), resolve(dest, 'tokens.css'));
copyFileSync(resolve(srcRoot, 'src/spec-lens.css'), resolve(dest, 'spec-lens.css'));
copyFileSync(resolve(srcRoot, 'src/tokens/primitives.css'), resolve(dest, 'tokens/primitives.css'));
console.log('Vendored chrome CSS from', srcRoot);
