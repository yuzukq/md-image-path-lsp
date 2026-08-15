import * as path from 'node:path';

const PUBLIC_DIR_NAME = 'public';

export interface PathResolver {
  toInsertablePath(absoluteFilePath: string): string;
}

export function createPathResolver(workspaceRoot: string, publicDirExists: boolean): PathResolver {
  // public/ 配下はNext.jsの静的アセット規約でWebルート("/"始まり)として参照されるため、
  // ワークスペースルート相対ではなくpublic相対の絶対風パスを返す
  if (publicDirExists) {
    const publicRoot = path.join(workspaceRoot, PUBLIC_DIR_NAME);
    return {
      toInsertablePath(absoluteFilePath: string): string {
        const relative = path.relative(publicRoot, absoluteFilePath);
        return '/' + toPosixPath(relative);
      },
    };
  }

  return {
    toInsertablePath(absoluteFilePath: string): string {
      const relative = path.relative(workspaceRoot, absoluteFilePath);
      return toPosixPath(relative);
    },
  };
}

function toPosixPath(p: string): string {
  return p.split(path.sep).join('/');
}
