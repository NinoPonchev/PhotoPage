import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const data = JSON.parse(readFileSync(new URL('../data/site.json', import.meta.url)));
for (const photo of data.photos) {
  assert(['automotive', 'portrait'].includes(photo.category), `Invalid category: ${photo.file}`);
  assert(photo.alt && photo.width > 0 && photo.height > 0, `Missing metadata: ${photo.file}`);
  // Full-resolution originals stay local and are not required for a clone or deployment.
  for (const size of [600, 1200, 1920]) {
    const file = `images/web/${photo.file.replace(/\.[^.]+$/, '')}-${size}.jpg`;
    assert(existsSync(new URL(`../public/${file}`, import.meta.url)), `Missing public image: ${file}`);
    assert(existsSync(new URL(`../dist/${file}`, import.meta.url)), `Missing built image: ${file}`);
  }
}
for (const page of ['index', 'cars', 'portraits', 'booking', 'impressum', 'privacy']) {
  const html = readFileSync(new URL(`../dist/${page}.html`, import.meta.url), 'utf8');
  assert(html.includes('id="root"') && html.includes('type="module"'), `Invalid React entry: ${page}`);
  for (const match of html.matchAll(/(?:src|href)="(\.\/assets\/[^"?#]+)"/g)) {
    assert(existsSync(new URL(`../dist/${match[1]}`, import.meta.url)), `Missing bundle: ${match[1]}`);
  }
}
assert(new Set(data.packages.map(item => item.id)).size === data.packages.length, 'Package IDs must be unique');
console.log(`PASS: six React build entries, all bundles, ${data.photos.length} photo manifest entries and 30 responsive image copies.`);
