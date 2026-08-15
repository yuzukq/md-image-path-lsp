import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { watchForChanges } from './watcher.ts';

function makeTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'watcher-test-'));
}

test('ファイル追加でコールバックが呼ばれる', async () => {
  const root = makeTmpDir();
  let called = false;
  const dispose = watchForChanges(root, () => {
    called = true;
  });

  await new Promise((r) => setTimeout(r, 100));
  fs.writeFileSync(path.join(root, 'new.png'), '');
  await new Promise((r) => setTimeout(r, 500));
  dispose();

  assert.equal(called, true);
});

test('連続した変更はデバウンスされ1回のコールバックにまとまる', async () => {
  const root = makeTmpDir();
  let callCount = 0;
  const dispose = watchForChanges(root, () => {
    callCount++;
  });

  await new Promise((r) => setTimeout(r, 100));
  fs.writeFileSync(path.join(root, 'a.png'), '');
  fs.writeFileSync(path.join(root, 'b.png'), '');
  fs.writeFileSync(path.join(root, 'c.png'), '');
  await new Promise((r) => setTimeout(r, 500));
  dispose();

  assert.equal(callCount, 1);
});

test('dispose後の変更ではコールバックが呼ばれない', async () => {
  const root = makeTmpDir();
  let called = false;
  const dispose = watchForChanges(root, () => {
    called = true;
  });

  await new Promise((r) => setTimeout(r, 100));
  dispose();
  fs.writeFileSync(path.join(root, 'after-dispose.png'), '');
  await new Promise((r) => setTimeout(r, 500));

  assert.equal(called, false);
});
