import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPathResolver } from './pathResolver.ts';

test('public/ がある場合、public相対の絶対風パスを返す', () => {
  const resolver = createPathResolver('/repo', true);
  const result = resolver.toInsertablePath('/repo/public/images/logo.png');
  assert.equal(result, '/images/logo.png');
});

test('public/ がある場合、publicルート直下のファイルもスラッシュ始まりになる', () => {
  const resolver = createPathResolver('/repo', true);
  const result = resolver.toInsertablePath('/repo/public/logo.png');
  assert.equal(result, '/logo.png');
});

test('public/ が無い場合、ワークスペースルート相対パスを返す', () => {
  const resolver = createPathResolver('/repo', false);
  const result = resolver.toInsertablePath('/repo/assets/logo.png');
  assert.equal(result, 'assets/logo.png');
});

test('ネストしたディレクトリでもposix区切りで返す', () => {
  const resolver = createPathResolver('/repo', false);
  const result = resolver.toInsertablePath('/repo/assets/img/2026/logo.png');
  assert.equal(result, 'assets/img/2026/logo.png');
});
