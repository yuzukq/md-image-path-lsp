import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isInsideImageLinkPath } from './completionContext.ts';

test('![alt]( の直後は true', () => {
  assert.equal(isInsideImageLinkPath('![alt]('), true);
});

test('通常のリンク [text]( は false (画像記法ではない)', () => {
  assert.equal(isInsideImageLinkPath('[text]('), false);
});

test('パスを途中まで入力済みでも true', () => {
  assert.equal(isInsideImageLinkPath('![alt](foo/bar'), true);
});

test('既に閉じ括弧まで入力済みなら false', () => {
  assert.equal(isInsideImageLinkPath('![alt](foo/bar)'), false);
});

test('1行に複数の画像記法があっても、直近の未クローズなものを検出する', () => {
  assert.equal(isInsideImageLinkPath('![a](one.png)![b]('), true);
});

test('通常リンクの後ろに画像記法が続く場合も検出する', () => {
  assert.equal(isInsideImageLinkPath('[text](url.md)![img]('), true);
});

test('alt文字列の入力中(まだ ]( に到達していない)は false', () => {
  assert.equal(isInsideImageLinkPath('![al'), false);
});

test('Markdown記法が無いプレーンテキストは false', () => {
  assert.equal(isInsideImageLinkPath('just text'), false);
});

test('画像記法を含む行でも、その後の別テキスト入力中なら false', () => {
  assert.equal(isInsideImageLinkPath('![a](one.png) some text'), false);
});
