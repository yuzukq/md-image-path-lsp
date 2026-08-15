import * as path from 'node:path';

export type PathBasis =
  | { kind: 'public'; publicDir: string }
  | { kind: 'relative'; currentFileDir: string };

export function toInsertablePath(absoluteFilePath: string, basis: PathBasis): string {
  if (basis.kind === 'public') {
    // public/ 配下はviteやNext.jsの静的アセット規約でWebルート("/"始まり)として参照されるため、
    // 編集中ファイルの位置に関わらずpublic相対の絶対風パスを返す
    const relative = path.relative(basis.publicDir, absoluteFilePath);
    return '/' + toPosixPath(relative);
  }

  const relative = path.relative(basis.currentFileDir, absoluteFilePath);
  return toPosixPath(relative);
}

function toPosixPath(p: string): string {
  return p.split(path.sep).join('/');
}
