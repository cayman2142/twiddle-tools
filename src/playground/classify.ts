/* The engine applies edits as inline `!important` styles (applyEdit in the
 * product's src/core/legacy.js) and edits text through a temporary
 * contentEditable marked .sl-text-editing. Diffing the style attribute tells
 * us which property moved; that is all the checklist needs. */

export type ChangeKind = 'space' | 'colour' | 'text';

export function parseStyle(style: string | null): Map<string, string> {
  const out = new Map<string, string>();
  if (!style) return out;
  for (const decl of style.split(';')) {
    const colon = decl.indexOf(':');
    if (colon < 0) continue;
    const prop = decl.slice(0, colon).trim().toLowerCase();
    if (prop) out.set(prop, decl.slice(colon + 1).trim());
  }
  return out;
}

export function changedProps(before: string | null, after: string | null): string[] {
  const a = parseStyle(before);
  const b = parseStyle(after);
  const props = new Set([...a.keys(), ...b.keys()]);
  return [...props].filter((prop) => a.get(prop) !== b.get(prop));
}

const SPACE = /^(?:(?:padding|margin)(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?|(?:row-|column-)?gap|border(?:-[a-z]+)*-radius)$/;
const COLOUR = /^(?:color|fill|stroke|outline-color|background(?:-color|-image)?|border(?:-[a-z]+)*-color)$/;

export function categoryOf(prop: string): 'space' | 'colour' | null {
  if (SPACE.test(prop)) return 'space';
  if (COLOUR.test(prop)) return 'colour';
  return null;
}

export type MutationFacts = {
  type: MutationRecordType;
  attributeName: string | null;
  oldValue: string | null;
  /** The element's style attribute now; only read for attribute mutations. */
  newValue: string | null;
  /** The mutated node sits inside an element the engine is text-editing. */
  inTextEdit: boolean;
};

export function classifyMutation(m: MutationFacts): ChangeKind[] {
  if (m.type === 'attributes') {
    if (m.attributeName !== 'style') return [];
    const kinds = new Set<ChangeKind>();
    for (const prop of changedProps(m.oldValue, m.newValue)) {
      const kind = categoryOf(prop);
      if (kind) kinds.add(kind);
    }
    return [...kinds];
  }
  return m.inTextEdit ? ['text'] : [];
}
