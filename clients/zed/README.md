# Markdown Image Path Completion (Zed extension)

Markdown の画像記法 `![alt](...)` の中で、ワークスペース内の画像ファイルへの相対パスを補完する Zed 拡張機能です。

補完ロジック自体は [md-image-path-lsp](https://www.npmjs.com/package/md-image-path-lsp) という Language Server として実装されており、この拡張機能はそれを Zed から起動するための薄いラッパーです。初回起動時に npm レジストリから自動的にダウンロードされるため、事前に手動でインストールする必要はありません。

## できること

- `![alt](` の中にカーソルがあるときだけ補完候補を出す(通常のリンク `[text](` には反応しない)
- ワークスペース内に `public/` ディレクトリがあれば、Next.js の静的アセット規約に合わせて `public` 相対の絶対風パス(`/images/logo.png` 等)を返す。無ければワークスペースルート相対パスを返す
- 起動後に追加・削除された画像ファイルもリアルタイムで反映

詳しい仕組みは [md-image-path-lsp のREADME](https://github.com/yuzukq/md-image-path-lsp/tree/main/server) を参照してください。

## インストール

現在は Zed の "Install Dev Extension" 機能を使ったローカルインストールに対応しています。このディレクトリを指定してください。

## License

MIT
