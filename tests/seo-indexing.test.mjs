import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('Weatherly publishes one canonical public root without indexing query variants', () => {
  const layout = read('src/app/layout.tsx');
  const sitemap = read('src/app/sitemap.ts');
  const robots = read('src/app/robots.ts');
  const page = read('src/app/page.tsx');

  assert.ok(layout.includes("const siteUrl = 'https://weatherly.halilyesilyurt.com'"));
  assert.ok(layout.includes("alternates: { canonical: '/' }"));
  assert.ok(sitemap.includes('return [{ url: siteUrl }]'));
  assert.ok(!sitemap.includes('searchParams') && !sitemap.includes('URLSearchParams'));
  assert.ok(robots.includes("userAgent: '*', allow: '/'"));
  assert.ok(robots.includes('/sitemap.xml'));
  assert.ok(page.includes('window.location.search'));
});
