import * as fs from 'node:fs';
import * as path from 'node:path';
import { globby } from 'globby';
import { createPathResolver } from './pathResolver.ts';

const PUBLIC_DIR_NAME = 'public';
const IMAGE_GLOB = '**/*.{png,jpg,jpeg,gif,svg,webp,avif}';

export class ImageIndex {
  private readonly workspaceRoot: string;
  private cache: string[] = [];

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  async refresh(): Promise<void> {
    const publicDir = path.join(this.workspaceRoot, PUBLIC_DIR_NAME);
    const publicDirExists = fs.existsSync(publicDir) && fs.statSync(publicDir).isDirectory();
    // public/ がある場合、その外の画像はWebから参照できないため候補から除外する
    const searchRoot = publicDirExists ? publicDir : this.workspaceRoot;

    const files = await globby([IMAGE_GLOB], {
      cwd: searchRoot,
      gitignore: true,
      absolute: true,
    });

    const resolver = createPathResolver(this.workspaceRoot, publicDirExists);
    this.cache = files.map((f) => resolver.toInsertablePath(f));
  }

  getAll(): readonly string[] {
    return this.cache;
  }
}
