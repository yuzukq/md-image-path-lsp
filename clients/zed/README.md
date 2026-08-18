# Markdown Image Path Completion (Zed extension)

[日本語](./README.ja.md)

A Zed extension that completes relative paths to image files in your workspace inside Markdown `![alt](...)` syntax.

The completion logic itself is implemented as a Language Server, [md-image-path-lsp](https://www.npmjs.com/package/md-image-path-lsp), and this extension is a thin wrapper that launches it from Zed. It's downloaded automatically from the npm registry on first launch, so no manual installation is needed beforehand.

## Features

- Only suggests completions when the cursor is inside `![alt](` (a plain link `[text](` is ignored)
- If a `public/` directory exists in the workspace, returns `public`-relative absolute-style paths (e.g. `/images/logo.png`) following the Next.js static asset convention. Otherwise, returns paths relative to the Markdown file being edited (e.g. `../assets/logo.png`)
- Image files added or removed after startup are reflected in real time

See the [md-image-path-lsp README](https://github.com/yuzukq/md-image-path-lsp/tree/main/server) for how it works under the hood.

## Installation

Currently only local installation via Zed's "Install Dev Extension" feature is supported. Point it at this directory.

## License

MIT
