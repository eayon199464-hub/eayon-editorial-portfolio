import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, clampPage, turnFromGesture } from '../src/narrative.js';

test('cover precedes exactly three bilingual thematic chapters', () => {
  assert.equal(clampPage(-1), 0);
  assert.equal(clampPage(4), 3);
  assert.equal(CHAPTERS.length, 3);
  for (const chapter of CHAPTERS) for (const key of ['label','labelEn','line','lineEn','text','textEn','bridge','bridgeEn']) assert.ok(chapter[key]);
});
test('page turns are deliberate, directional and do not treat a tap as a swipe', () => {
  assert.equal(turnFromGesture(5, 900), 0);
  assert.equal(turnFromGesture(-100, 0), 1);
  assert.equal(turnFromGesture(100, 0), -1);
  assert.equal(turnFromGesture(-30, -600), 1);
  assert.equal(turnFromGesture(20, 40), 0);
});
