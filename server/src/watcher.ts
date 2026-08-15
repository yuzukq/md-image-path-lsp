import * as fs from 'node:fs';

const DEBOUNCE_MS = 300;

// LSPクライアント側のdidChangeWatchedFiles対応状況に依存しないよう
// サーバー自身がfs.watchでワークスペースを監視する
export function watchForChanges(root: string, onChange: () => void): () => void {
  let timer: NodeJS.Timeout | undefined;

  const watcher = fs.watch(root, { recursive: true }, () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(onChange, DEBOUNCE_MS);
  });

  return () => {
    if (timer) clearTimeout(timer);
    watcher.close();
  };
}
