/**
 * Copy Twiddle chrome CSS from the product repo, renamed into the twc- namespace.
 * Usage: node scripts/vendor-chrome.mjs [path-to-product-repo]
 *
 * Why the rename: the extension injects its own spec-lens.css into whatever
 * page it runs on — including twiddle.tools. If the staged replicas here used
 * the same .sl-* classes and --sl-* tokens, the live plugin's rules would grab
 * the replicas (position: fixed, 2147483xxx z-index) and this site's copy would
 * restyle the live plugin. twc- replicas and sl- chrome never match each other.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const srcRoot = resolve(process.argv[2] ?? '../twiddle');
const dest = resolve('vendor/chrome');

export function toReplicaNamespace(css) {
  return css
    .replace(/data-sl-/g, 'data-twc-')
    .replace(/(?<![\w-])(-{0,2})sl-/g, '$1twc-');
}

const FILES = ['tokens.css', 'spec-lens.css', 'tokens/primitives.css'];

mkdirSync(resolve(dest, 'tokens'), { recursive: true });
for (const file of FILES) {
  const css = readFileSync(resolve(srcRoot, 'src', file), 'utf8');
  writeFileSync(resolve(dest, file), toReplicaNamespace(css));
}
console.log('Vendored chrome CSS (twc- namespace) from', srcRoot);
