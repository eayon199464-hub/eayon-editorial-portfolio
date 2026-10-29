import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPERIENCES, FEATURED, imageFor } from '../src/content.js';
import { existsSync, readFileSync } from 'node:fs';

test('six existing career records stay bilingual and complete', () => {
  assert.equal(EXPERIENCES.length, 6);
  for (const item of EXPERIENCES) {
    assert.equal(item.details.length, item.detailsEn.length);
    assert.equal(item.facts.length, item.factsEn.length);
    assert.ok(item.role && item.roleEn && item.range);
    assert.ok(existsSync(new URL('../public/' + imageFor(item).slice(2), import.meta.url)));
  }
});
test('featured gallery follows selected editorial order', () => {
  assert.deepEqual(FEATURED.map(item => item.year), ['2020', '2026', '2025']);
});
test('the personal principle and Eayon name are present', () => {
  const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.ok(source.includes('如无必要，勿增实体。'));
  assert.ok(source.includes('EAYON'));
  assert.ok(!source.includes('TIAN YIXIONG'));
});
test('npm lockfile includes the installed editorial dependency graph', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
  const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url)));
  assert.deepEqual(lock.packages[''].dependencies, pkg.dependencies);
  for (const name of ['motion', 'framer-motion', 'motion-dom', 'motion-utils', 'tslib', '@phosphor-icons/react', '@fontsource/bodoni-moda', '@fontsource/inter']) {
    assert.ok(lock.packages['node_modules/' + name]?.integrity, name);
  }
});
