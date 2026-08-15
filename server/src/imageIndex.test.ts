import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { ImageIndex } from './imageIndex.ts';

function makeTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'image-index-test-'));
}

function writeFile(root: string, relPath: string): void {
  const full = path.join(root, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, '');
}

test('public/ が無い場合、ワークスペース全体から画像を拾いルート相対パスを返す', async () => {
  const root = makeTmpDir();
  writeFile(root, 'assets/logo.png');
  writeFile(root, 'assets/img/photo.jpeg');
  writeFile(root, 'README.md');

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual(
    [...index.getAll()].sort(),
    ['assets/img/photo.jpeg', 'assets/logo.png'].sort()
  );
});

test('public/ がある場合、public配下だけを探索しスラッシュ始まりのパスを返す', async () => {
  const root = makeTmpDir();
  writeFile(root, 'public/images/logo.png');
  writeFile(root, 'src/unrelated.png'); // public外は対象外

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual([...index.getAll()], ['/images/logo.png']);
});

test('.gitignore に書かれたファイルは除外される', async () => {
  const root = makeTmpDir();
  writeFile(root, '.gitignore');
  fs.writeFileSync(path.join(root, '.gitignore'), 'ignored/\n');
  writeFile(root, 'assets/logo.png');
  writeFile(root, 'ignored/secret.png');

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual([...index.getAll()], ['assets/logo.png']);
});

test('画像以外の拡張子は候補に含まれない', async () => {
  const root = makeTmpDir();
  writeFile(root, 'assets/logo.png');
  writeFile(root, 'assets/notes.txt');
  writeFile(root, 'assets/script.ts');

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual([...index.getAll()], ['assets/logo.png']);
});
