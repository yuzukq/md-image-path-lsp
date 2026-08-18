<div align="center">

# md-image-path-lsp

[日本語](./README.ja.md)

**A Language Server that completes Markdown image paths against the real files in your workspace**

[![npm version](https://img.shields.io/npm/v/md-image-path-lsp.svg)](https://www.npmjs.com/package/md-image-path-lsp)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./server/LICENSE)

</div>

---

A Language Server that completes relative paths to image files in your workspace inside Markdown `![alt](...)` syntax, plus a Zed extension and a VS Code extension that use it.

## Two path resolution modes

Works naturally both in frameworks that serve `public/` as static assets (Next.js, Vite, etc.) and in plain Markdown editing with no framework at all.

<table>
<tr>
<th align="left">Framework environment with a <code>public/</code> directory (Next.js / Vite, etc.)</th>
</tr>
<tr>
<td>

Treats `public/` as the web root and completes absolute-style paths such as `/images/logo.png`.

![Completion in an environment with public/](./.github/images/prev_public.png)

</td>
</tr>
<tr>
<th align="left">Plain Markdown editing with no <code>public/</code> directory</th>
</tr>
<tr>
<td>

Completes paths relative to the file being edited (e.g. `../images/logo.png`). Suited for blog posts, READMEs, and anything viewed as a raw file (Obsidian, GitHub, static file viewers).

![Completion in an environment without public/](./.github/images/prev_nonpublic.png)

</td>
</tr>
</table>

## Structure

```
.
├── server/          The Language Server itself (npm: md-image-path-lsp)
├── clients/zed/     Zed extension (fetches server/ from npm automatically)
└── clients/vscode/  VS Code extension (bundles server/ as a dependency)
```

`server/` is editor-agnostic and can be used from any LSP client via `npx md-image-path-lsp --stdio`, not just Zed and VS Code. See each directory's README for details.

- [server/README.md](./server/README.md) — how to use the Language Server itself
- [clients/zed/README.md](./clients/zed/README.md) — setting up the Zed extension
- [clients/vscode/README.md](./clients/vscode/README.md) — setting up the VS Code extension

## Editor support

| Editor | Status |
|---|---|
| **Zed** | Supported via `clients/zed/` |
| **Neovim / Helix / Emacs (eglot)**, etc. | Works with any generic LSP client config that invokes `npx md-image-path-lsp --stdio` directly |
| **VS Code** | Published on the [Marketplace](https://marketplace.visualstudio.com/items?itemName=yuzukq.md-image-path-lsp-vscode) |

---

<div align="center">

Released under the [MIT License](./server/LICENSE)

</div>
