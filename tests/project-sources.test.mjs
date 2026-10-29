import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { PROJECT_ARCHIVES } from '../src/projectSources.js';
import { EXPERIENCES } from '../src/content.js';

test('public archives map only to exact, researched projects', () => {
  assert.deepEqual(Object.keys(PROJECT_ARCHIVES), ['2020']);
  for (const year of Object.keys(PROJECT_ARCHIVES)) assert.ok(EXPERIENCES.some(x => x.year === year));
});
test('archive images exist with dimensions, bilingual descriptions and attribution', () => {
  for (const archive of Object.values(PROJECT_ARCHIVES)) {
    assert.ok(archive.credit && archive.creditEn && archive.creditUrl.startsWith('https://'));
    for (const image of [archive.hero, ...archive.gallery]) {
      assert.ok(existsSync(new URL('../public/' + image.src.slice(2), import.meta.url)));
      assert.ok(image.width > 0 && image.height > 0 && image.alt && image.altEn);
    }
    assert.ok(archive.recognitionNote && archive.recognitionNoteEn);
    for (const source of archive.sources) assert.ok(source.label && source.labelEn && new URL(source.url).protocol === 'https:');
  }
});
test('concept-image badges are removed without describing artwork as project photos', () => {
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.ok(!app.includes('概念影像') && !app.includes('CONCEPT STUDY'));
  assert.ok(app.includes('editorialAlt(cn)'));
  assert.ok(app.includes('PublicArchive archive={archive}'));
});
test('unverified MUSE claim is not shown as a confirmed award', () => {
  assert.ok(!EXPERIENCES.find(x => x.year === '2020').awards.some(x => x.includes('MUSE')));
});
test('inline photo credits are omitted in both languages while project provenance stays available', () => {
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.ok(!app.includes('archive-credit'));
  assert.ok(!app.includes('archive.credit'));
  assert.ok(app.includes('archive.sources.map'));
  assert.ok(app.includes('archive.recognitionNote'));
});
