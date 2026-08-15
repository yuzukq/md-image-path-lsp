# md-image-path-lsp

Markdown の画像記法 `![alt](...)` の中で、ワークスペース内の画像ファイル(png / jpg / jpeg / gif / svg / webp / avif)を相対パス補完する Language Server です。

## できること

- `![alt](` の中にカーソルがあるときだけ補完候補を出す(通常のリンク `[text](` には反応しない)
- 候補のパスは、途中のディレクトリ名を含めた曖昧検索でフィルタできる
- `.gitignore` に書かれたファイルは候補から除外
- ワークスペース内に `public/` ディレクトリが存在する場合、Next.js の静的アセット規約(`public/images/logo.png` → `/images/logo.png`)に合わせて `public` 相対の絶対風パスを返す。無ければワークスペースルート相対パスを返す
- 起動後に追加・削除された画像ファイルもリアルタイムで反映(`fs.watch` によるファイル監視)

## 利用方法

このパッケージは標準の Language Server Protocol (stdio) で動作するため、`npx` 経由で任意の LSP クライアントから直接起動できます。

```bash
npx md-image-path-lsp --stdio
```

### Neovim (nvim-lspconfig) の設定例

```lua
local lspconfig = require('lspconfig')
local configs = require('lspconfig.configs')

if not configs.md_image_path_lsp then
  configs.md_image_path_lsp = {
    default_config = {
      cmd = { 'npx', 'md-image-path-lsp', '--stdio' },
      filetypes = { 'markdown' },
      root_dir = lspconfig.util.root_pattern('.git'),
    },
  }
end

configs.md_image_path_lsp.setup {}
```

## 動作要件

Node.js v19.1.0 以降(`fs.watch` の `recursive` オプションが Linux でも正式サポートされたバージョン)。

## License

MIT
