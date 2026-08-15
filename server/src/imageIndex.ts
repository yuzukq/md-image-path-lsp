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
    const candidatePublicDir = path.join(this.workspaceRoot, PUBLIC_DIR_NAME);
    const publicDirExists =
      fs.existsSync(candidatePublicDir) && fs.statSync(candidatePublicDir).isDirectory();
    this.publicDir = publicDirExists ? candidatePublicDir : undefined;

    // public/ がある場合、その外の画像はWebから参照できないため候補から除外する
    const searchRoot = this.publicDir ?? this.workspaceRoot;

    this.cache = await globby([IMAGE_GLOB], {
      cwd: searchRoot,
      gitignore: true,
      absolute: true,
    });
  }

  getAllAbsolutePaths(): readonly string[] {
    return this.cache;
  }

  getPublicDir(): string | undefined {
    return this.publicDir;
  }
}
