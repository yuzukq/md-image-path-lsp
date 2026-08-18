# Markdown Image Path Completion (VS Code extension)

[English](./README.md)

Markdown の画像記法 `![alt](...)` の中で、ワークスペース内の画像ファイルへの相対パスを補完する VS Code 拡張機能です。

補完ロジック自体は [md-image-path-lsp](https://www.npmjs.com/package/md-image-path-lsp) という Language Server として実装されており、この拡張機能はそれを VS Code から起動するための薄いラッパーです。

## できること

- `![alt](` の中にカーソルがあるときだけ補完候補を出す(通常のリンク `[text](` には反応しない)
- ワークスペース内に `public/` ディレクトリがあれば、Next.js の静的アセット規約に合わせて `public` 相対の絶対風パス(`/images/logo.png` 等)を返す。無ければ、編集中の Markdown ファイルから見た相対パス(`../assets/logo.png` 等)を返す
- 起動後に追加・削除された画像ファイルもリアルタイムで反映

詳しい仕組みは [md-image-path-lsp のREADME](https://github.com/yuzukq/md-image-path-lsp/tree/main/server) を参照してください。

## インストール

[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=yuzukq.md-image-path-lsp-vscode) から入手できます。VS Code の拡張機能タブで `Markdown Image Path Completion` を検索するか、以下のコマンドでインストールしてください。

```sh
code --install-extension yuzukq.md-image-path-lsp-vscode
```

### ソースからのビルド(開発用)

```sh
git clone https://github.com/yuzukq/md-image-path-lsp.git
cd md-image-path-lsp/clients/vscode
npm install
npm run compile
```

VS Code でこのディレクトリを開き、`F5` で Extension Development Host を起動して動作を確認できます。

## License

MIT
