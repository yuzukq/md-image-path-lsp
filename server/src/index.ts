import { fileURLToPath } from 'node:url';
import {
  createConnection,
  ProposedFeatures,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  TextDocuments,
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver/node.js';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { ImageIndex } from './imageIndex.ts';
import { isInsideImageLinkPath } from './completionContext.ts';
import { getTextBeforeCursor } from './documentUtils.ts';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

let imageIndex: ImageIndex | undefined;
let refreshPromise: Promise<void> = Promise.resolve();

function getWorkspaceRoot(params: InitializeParams): string | undefined {
  if (params.workspaceFolders && params.workspaceFolders.length > 0) {
    return fileURLToPath(params.workspaceFolders[0].uri);
  }
  if (params.rootUri) {
    return fileURLToPath(params.rootUri);
  }
  return params.rootPath ?? undefined;
}

connection.onInitialize((params: InitializeParams): InitializeResult => {
  const workspaceRoot = getWorkspaceRoot(params);
  if (workspaceRoot) {
    imageIndex = new ImageIndex(workspaceRoot);
    refreshPromise = imageIndex.refresh();
  }

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        triggerCharacters: ['('],
      },
    },
  };
});

connection.onCompletion(async (params): Promise<CompletionItem[]> => {
  if (!imageIndex) return [];

  const document = documents.get(params.textDocument.uri);
  if (!document) return [];

  const textBeforeCursor = getTextBeforeCursor(document, params.position);
  if (!isInsideImageLinkPath(textBeforeCursor)) return [];

  await refreshPromise;

  return imageIndex.getAll().map(
    (imagePath): CompletionItem => ({
      label: imagePath,
      insertText: imagePath,
      kind: CompletionItemKind.File,
    })
  );
});

documents.listen(connection);
connection.listen();
