import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position } from 'vscode-languageserver/node.js';

export function getTextBeforeCursor(document: TextDocument, position: Position): string {
  const lineStart: Position = { line: position.line, character: 0 };
  return document.getText({ start: lineStart, end: position });
}
