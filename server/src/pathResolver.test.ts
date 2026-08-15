import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toInsertablePath } from './pathResolver.ts';

test('public基準: publicルート直下のファイルはスラッシュ始まりのファイル名になる', () => {
  const result = toInsertablePath('/repo/public/logo.png', {
    kind: 'public',
    publicDir: '/repo/public',
  });
  assert.equal(result, '/logo.png');
});

test('public基準: ネストしたファイルもpublic相対の絶対風パスになる', () => {
  const result = toInsertablePath('/repo/public/images/logo.png', {
    kind: 'public',
    publicDir: '/repo/public',
  });
  assert.equal(result, '/images/logo.png');
});

test('relative基準: 編集中ファイルと同じディレクトリならファイル名のみ', () => {
  const result = toInsertablePath('/repo/blog/logo.png', {
    kind: 'relative',
    currentFileDir: '/repo/blog',
  });
  assert.equal(result, 'logo.png');
});

test('relative基準: 編集中ファイルのサブディレクトリならそのパスを返す', () => {
  const result = toInsertablePath('/repo/blog/assets/logo.png', {
    kind: 'relative',
    currentFileDir: '/repo/blog',
  });
  assert.equal(result, 'assets/logo.png');
});

test('relative基準: 編集中ファイルより上の階層にあれば ../ を含む', () => {
  const result = toInsertablePath('/repo/assets/logo.png', {
    kind: 'relative',
    currentFileDir: '/repo/blog/posts',
  });
  assert.equal(result, '../../assets/logo.png');
});

test('relative基準でもposix区切りで返す', () => {
  const result = toInsertablePath('/repo/blog/assets/img/2026/logo.png', {
    kind: 'relative',
    currentFileDir: '/repo/blog',
  });
  assert.equal(result, 'assets/img/2026/logo.png');
});
