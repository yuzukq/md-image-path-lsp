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

test('public/ が無い場合、ワークスペース全体から画像を絶対パスで拾う', async () => {
  const root = makeTmpDir();
  writeFile(root, 'assets/logo.png');
  writeFile(root, 'assets/img/photo.jpeg');
  writeFile(root, 'README.md');

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual(
    [...index.getAllAbsolutePaths()].sort(),
    [path.join(root, 'assets/img/photo.jpeg'), path.join(root, 'assets/logo.png')].sort()
  );
  assert.equal(index.getPublicDir(), undefined);
});

test('public/ がある場合、public配下だけを探索し、getPublicDir()がそのパスを返す', async () => {
  const root = makeTmpDir();
  writeFile(root, 'public/images/logo.png');
  writeFile(root, 'src/unrelated.png'); // public外は対象外

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual([...index.getAllAbsolutePaths()], [path.join(root, 'public/images/logo.png')]);
  assert.equal(index.getPublicDir(), path.join(root, 'public'));
});

test('.gitignore に書かれたファイルは除外される', async () => {
  const root = makeTmpDir();
  writeFile(root, '.gitignore');
  fs.writeFileSync(path.join(root, '.gitignore'), 'ignored/\n');
  writeFile(root, 'assets/logo.png');
  writeFile(root, 'ignored/secret.png');

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual([...index.getAllAbsolutePaths()], [path.join(root, 'assets/logo.png')]);
});

test('大文字・混在拡張子(.JPG / .Png)の画像も候補に含まれる', async () => {
  const root = makeTmpDir();
  writeFile(root, 'assets/photo.JPG'); // iPhone互換優先設定の出力形式
  writeFile(root, 'assets/icon.Png');
  writeFile(root, 'assets/logo.png');

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual(
    [...index.getAllAbsolutePaths()].sort(),
    [
      path.join(root, 'assets/icon.Png'),
      path.join(root, 'assets/logo.png'),
      path.join(root, 'assets/photo.JPG'),
    ].sort()
  );
});

test('大文字の Public/ ディレクトリもpublicとして検出され、実際のディレクトリ名が返る', async () => {
  const root = makeTmpDir();
  writeFile(root, 'Public/images/logo.png'); // Vaporなどの規約

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual([...index.getAllAbsolutePaths()], [path.join(root, 'Public/images/logo.png')]);
  assert.equal(index.getPublicDir(), path.join(root, 'Public'));
});

test('画像以外の拡張子は候補に含まれない', async () => {
  const root = makeTmpDir();
  writeFile(root, 'assets/logo.png');
  writeFile(root, 'assets/notes.txt');
  writeFile(root, 'assets/script.ts');

  const index = new ImageIndex(root);
  await index.refresh();

  assert.deepEqual([...index.getAllAbsolutePaths()], [path.join(root, 'assets/logo.png')]);
});
