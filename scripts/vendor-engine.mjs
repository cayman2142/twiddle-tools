/**
 * Copy the shipped twiddle engine into public/playground/engine/ for the hero playground.
 * Usage: node scripts/vendor-engine.mjs [path-to-product-repo]
 *
 * Runs before dev and build. The output is gitignored: this repo is public, the
 * product is closed source, and the site serves exactly the build the Chrome Web
 * Store ships — nothing from src/. Refresh after a plugin release by rebuilding
 * here; public/playground/engine/VERSION says which one is live.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const srcRoot = resolve(process.argv[2] ?? '../twiddle');
const from = resolve(srcRoot, 'extension');
const dest = resolve('public/playground/engine');

const FILES = [
  ['spec-lens.js', 'spec-lens.js'],
  ['spec-lens.css', 'spec-lens.css'],
  ['THIRD-PARTY-NOTICES', 'THIRD-PARTY-NOTICES.txt'],
];

for (const [name] of FILES) {
  if (!existsSync(resolve(from, name))) {
    console.error(
      `vendor:engine: ${resolve(from, name)} is missing.\n` +
        `The playground needs the built extension from the product repo. Run there:\n` +
        `  cd ${srcRoot} && npm run sync:extension`,
    );
    process.exit(1);
  }
}

mkdirSync(dest, { recursive: true });
for (const [name, out] of FILES) copyFileSync(resolve(from, name), resolve(dest, out));
const { version } = JSON.parse(readFileSync(resolve(from, 'manifest.json'), 'utf8'));
writeFileSync(resolve(dest, 'VERSION'), `${version}\n`);
console.log(`Vendored twiddle engine ${version} from ${from}`);
