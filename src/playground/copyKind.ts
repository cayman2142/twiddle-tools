export type CopyKind = 'changes' | 'block';

/* Copy changes is `Copy all changes` in the panel's Changes view; everything
 * else that writes text (the toolbar's Agent MD / HTML block copy, its format
 * menu, Copy element, Ctrl+C) copies the pinned element, not the edits. */
export function copyKindOf(control: Element | null): CopyKind {
  return control?.closest('[data-sl-changes="copy"], .sl-changes') ? 'changes' : 'block';
}

/* Cut element (toolbar button or Ctrl/Cmd+X) also writes the element's HTML to
 * the clipboard, but it removes the element: that is an edit, not a copy. */
export function isCutControl(control: Element | null): boolean {
  return !!control?.closest('[aria-label="Cut element"]');
}

type Keys = Pick<KeyboardEvent, 'key' | 'code' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>;

export function isCutShortcut(e: Keys): boolean {
  if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return false;
  return e.key.toLowerCase() === 'x' || e.code === 'KeyX';
}
