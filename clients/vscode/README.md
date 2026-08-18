# Markdown Image Path Completion (VS Code extension)

[日本語](./README.ja.md)

A VS Code extension that completes relative paths to image files in your workspace inside Markdown `![alt](...)` syntax.

The completion logic itself is implemented as a Language Server, [md-image-path-lsp](https://www.npmjs.com/package/md-image-path-lsp), and this extension is a thin wrapper that launches it from VS Code.

## Features

- Only suggests completions when the cursor is inside `![alt](` (a plain link `[text](` is ignored)
- If a `public/` directory exists in the workspace, returns `public`-relative absolute-style paths (e.g. `/images/logo.png`) following the Next.js static asset convention. Otherwise, returns paths relative to the Markdown file being edited (e.g. `../assets/logo.png`)
- Image files added or removed after startup are reflected in real time

See the [md-image-path-lsp README](https://github.com/yuzukq/md-image-path-lsp/tree/main/server) for how it works under the hood.

## Installation

Available on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=yuzukq.md-image-path-lsp-vscode). Search for `Markdown Image Path Completion` in the Extensions tab, or install it with:

```sh
code --install-extension yuzukq.md-image-path-lsp-vscode
```

### Building from source (development)

```sh
git clone https://github.com/yuzukq/md-image-path-lsp.git
cd md-image-path-lsp/clients/vscode
npm install
npm run compile
```

Open this directory in VS Code and press `F5` to launch the Extension Development Host and try it out.

## License

MIT
