export type CopyKind = 'changes' | 'block';

/* Copy changes is `Copy all changes` in the panel's Changes view; everything
 * else that writes text (the toolbar's Agent MD / HTML block copy, its format
 * menu, Copy element, Ctrl+C) copies the pinned element, not the edits. */
export function copyKindOf(control: Element | null): CopyKind {
  return control?.closest('[data-sl-changes="copy"], .sl-changes') ? 'changes' : 'block';
}
