import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getTextBeforeCursor } from './documentUtils.ts';

test('カーソル位置までの行テキストを取得する', () => {
  const lineText = '![alt](foo';
  const doc = TextDocument.create('file:///test.md', 'markdown', 1, `${lineText}\nbar`);

  const text = getTextBeforeCursor(doc, { line: 0, character: lineText.length });

  assert.equal(text, lineText);
});

test('2行目のカーソル位置も正しく取得する(1行目に引きずられない)', () => {
  const secondLine = '![img](';
  const doc = TextDocument.create('file:///test.md', 'markdown', 1, `first line\n${secondLine}`);

  const text = getTextBeforeCursor(doc, { line: 1, character: secondLine.length });

  assert.equal(text, secondLine);
});

test('カーソルが行の途中にある場合は、そこまでのテキストだけを返す', () => {
  const doc = TextDocument.create('file:///test.md', 'markdown', 1, '![alt](foo)bar');

  const text = getTextBeforeCursor(doc, { line: 0, character: '![alt](foo)'.length });

  assert.equal(text, '![alt](foo)');
});
