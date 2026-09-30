// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { copyKindOf, isCutControl, isCutShortcut } from './copyKind';

beforeEach(() => {
  document.body.innerHTML = `
    <div data-sl-chrome>
      <div class="sl-changes">
        <button id="all" data-sl-changes="copy"></button>
        <div class="row"><button id="row"></button></div>
      </div>
      <button id="block" class="sl-toolbar__copy-block"></button>
      <button id="copy-el" aria-label="Copy element"></button>
      <button id="cut" aria-label="Cut element"><svg id="cut-icon"></svg></button>
      <div class="sl-toolbar__copy-menu"><button id="fmt" role="menuitemradio"></button></div>
    </div>`;
});

describe('copyKindOf', () => {
  it('Copy all changes is changes', () => expect(copyKindOf(document.getElementById('all'))).toBe('changes'));
  it('any copy inside the Changes view is changes', () => expect(copyKindOf(document.getElementById('row'))).toBe('changes'));
  it('the toolbar block copy is block', () => expect(copyKindOf(document.getElementById('block'))).toBe('block'));
  it('the format menu is block', () => expect(copyKindOf(document.getElementById('fmt'))).toBe('block'));
  it('a keyboard copy with no control is block', () => expect(copyKindOf(null)).toBe('block'));
});

describe('isCutControl', () => {
  it('the toolbar Cut button is a cut', () => expect(isCutControl(document.getElementById('cut'))).toBe(true));
  it('its icon is a cut too', () => expect(isCutControl(document.getElementById('cut-icon'))).toBe(true));
  it('Copy element is not a cut', () => expect(isCutControl(document.getElementById('copy-el'))).toBe(false));
  it('the block copy is not a cut', () => expect(isCutControl(document.getElementById('block'))).toBe(false));
  it('no control is not a cut', () => expect(isCutControl(null)).toBe(false));
});

describe('isCutShortcut', () => {
  const keys = { key: 'x', code: 'KeyX', ctrlKey: false, metaKey: false, altKey: false, shiftKey: false };
  it('Ctrl+X is a cut', () => expect(isCutShortcut({ ...keys, ctrlKey: true })).toBe(true));
  it('Cmd+X is a cut', () => expect(isCutShortcut({ ...keys, metaKey: true })).toBe(true));
  it('Ctrl+X on a non-Latin layout is a cut', () => expect(isCutShortcut({ ...keys, key: 'ч', ctrlKey: true })).toBe(true));
  it('Ctrl+C is not', () => expect(isCutShortcut({ ...keys, key: 'c', code: 'KeyC', ctrlKey: true })).toBe(false));
  it('a bare x is not', () => expect(isCutShortcut(keys)).toBe(false));
  it('Ctrl+Shift+X is not', () => expect(isCutShortcut({ ...keys, ctrlKey: true, shiftKey: true })).toBe(false));
});
