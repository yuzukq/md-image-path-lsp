// alt文字列に "]" を含む、パス自体に "(" ")" を含むケースは対象外
const IMAGE_LINK_PATH_PATTERN = /!\[[^\]]*\]\(([^)]*)$/;

export function isInsideImageLinkPath(textBeforeCursor: string): boolean {
  return IMAGE_LINK_PATH_PATTERN.test(textBeforeCursor);
}
