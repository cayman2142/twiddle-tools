// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { copyKindOf } from './copyKind';

beforeEach(() => {
  document.body.innerHTML = `
    <div data-sl-chrome>
      <div class="sl-changes">
        <button id="all" data-sl-changes="copy"></button>
        <div class="row"><button id="row"></button></div>
      </div>
      <button id="block" class="sl-toolbar__copy-block"></button>
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
