import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

export function activate(_context: ExtensionContext): void {

  // md-image-path-lspを普通の依存パッケージとして node_modulesから直接解決する
  const serverModule = require.resolve('md-image-path-lsp/dist/index.js');

  const serverOptions: ServerOptions = {
    // サーバーは--node-ipc引数の有無で接続方式を自動判定するため、標準出力を汚さないipcを選ぶ
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'markdown' }],
  };

  client = new LanguageClient(
    'md-image-path-lsp',
    'Markdown Image Path LSP',
    serverOptions,
    clientOptions,
  );

  // start()の失敗時エラーは出ないが補完も一切効かない状態を避けるため明示する
  client.start().catch((error: unknown) => {
    vscode.window.showErrorMessage(`md-image-path-lsp: failed to start language server: ${String(error)}`);
  });
}

export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}
