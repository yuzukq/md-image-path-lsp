# md-image-path-lsp

[日本語](./README.ja.md)

A Language Server that completes relative paths to image files (png / jpg / jpeg / gif / svg / webp / avif) in your workspace inside Markdown `![alt](...)` syntax.

## Features

- Only suggests completions when the cursor is inside `![alt](` (a plain link `[text](` is ignored)
- Candidate paths can be filtered with a fuzzy match that includes intermediate directory names
- Files listed in `.gitignore` are excluded from candidates
- If a `public/` directory exists in the workspace, returns `public`-relative absolute-style paths following the Next.js static asset convention (`public/images/logo.png` → `/images/logo.png`). Otherwise, returns paths relative to the Markdown file being edited (e.g. `../assets/logo.png`)
- Image files added or removed after startup are reflected in real time (via `fs.watch`)

## Usage

This package speaks the standard Language Server Protocol over stdio, so it can be launched directly from any LSP client via `npx`.

```bash
npx md-image-path-lsp --stdio
```

### Example: Neovim (nvim-lspconfig)

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

## Requirements

Node.js v19.1.0 or later (the version where `fs.watch`'s `recursive` option gained official support on Linux).

## License

MIT
