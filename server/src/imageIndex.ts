import * as fs from 'node:fs';
import * as path from 'node:path';
import { globby } from 'globby';

const PUBLIC_DIR_NAME = 'public';
const IMAGE_GLOB = '**/*.{png,jpg,jpeg,gif,svg,webp,avif}';

export class ImageIndex {
  private readonly workspaceRoot: string;
  private cache: string[] = [];
  private publicDir: string | undefined;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  async refresh(): Promise<void> {
    this.publicDir = findPublicDir(this.workspaceRoot);

    // public/ がある場合、その外の画像はWebから参照できないため候補から除外する
    const searchRoot = this.publicDir ?? this.workspaceRoot;

    this.cache = await globby([IMAGE_GLOB], {
      cwd: searchRoot,
      gitignore: true,
      absolute: true,
      // iPhoneの写真などで拡張子が大文字(.JPG等)になるため、大小を区別せずマッチさせる
      caseSensitiveMatch: false,
    });
  }

  getAllAbsolutePaths(): readonly string[] {
    return this.cache;
  }

  getPublicDir(): string | undefined {
    return this.publicDir;
  }
}

// Vaporのように大文字の `Public/` を静的アセットのWebルートにするフレームワークがあり、
// macOS/Windowsではfs自体が大小を区別せず既に `Public/` を拾えていたため、
// OS間で挙動が揃うようディレクトリ名の大小を無視して検出する
function findPublicDir(workspaceRoot: string): string | undefined {
  let entries: string[];
  try {
    entries = fs.readdirSync(workspaceRoot);
  } catch {
    return undefined;
  }

  const candidates = entries.filter((name) => name.toLowerCase() === PUBLIC_DIR_NAME).sort();
  // case-sensitive FSで 'public' と 'Public' が並存する場合は完全一致を優先して決定的にする
  const ordered = candidates.includes(PUBLIC_DIR_NAME)
    ? [PUBLIC_DIR_NAME, ...candidates.filter((name) => name !== PUBLIC_DIR_NAME)]
    : candidates;

  for (const name of ordered) {
    const fullPath = path.join(workspaceRoot, name);
    if (fs.statSync(fullPath, { throwIfNoEntry: false })?.isDirectory()) {
      return fullPath;
    }
  }
  return undefined;
}
