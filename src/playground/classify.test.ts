import { describe, expect, it } from 'vitest';
import { categoryOf, changedProps, classifyMutation, parseStyle } from './classify';

describe('parseStyle', () => {
  it('reads declarations, keeping !important in the value', () => {
    const m = parseStyle('background-color: rgba(1, 2, 3, 0.9) !important; Padding: 8px');
    expect([...m]).toEqual([
      ['background-color', 'rgba(1, 2, 3, 0.9) !important'],
      ['padding', '8px'],
    ]);
  });
  it('is empty for null', () => expect(parseStyle(null).size).toBe(0));
});

describe('changedProps', () => {
  it('lists added and changed properties', () =>
    expect(changedProps('padding: 8px; color: red', 'padding: 8px; color: blue; margin: 4px')).toEqual(['color', 'margin']));
  it('lists removed properties', () => expect(changedProps('gap: 4px', '')).toEqual(['gap']));
});

describe('categoryOf', () => {
  it.each([
    ['padding', 'space'],
    ['padding-inline-start', 'space'],
    ['margin-top', 'space'],
    ['gap', 'space'],
    ['row-gap', 'space'],
    ['border-radius', 'space'],
    ['border-top-left-radius', 'space'],
    ['color', 'colour'],
    ['background', 'colour'],
    ['background-color', 'colour'],
    ['border-color', 'colour'],
    ['border-bottom-color', 'colour'],
    ['fill', 'colour'],
    ['width', null],
    ['font-size', null],
    ['transition', null],
  ])('%s → %s', (prop, kind) => expect(categoryOf(prop)).toBe(kind));
});

describe('classifyMutation', () => {
  const style = (oldValue: string | null, newValue: string | null) =>
    classifyMutation({ type: 'attributes', attributeName: 'style', oldValue, newValue, inTextEdit: false });

  it('a margin write is spacing', () => expect(style(null, 'margin: 8px !important')).toEqual(['space']));
  it('reports each kind once', () =>
    expect(style(null, 'background-color: red; border-top-left-radius: 4px; color: blue').sort()).toEqual(['colour', 'space']));
  it('ignores properties outside the checklist', () => expect(style(null, 'transition: none !important')).toEqual([]));
  it('ignores non-style attributes', () =>
    expect(classifyMutation({ type: 'attributes', attributeName: 'class', oldValue: 'a', newValue: null, inTextEdit: false })).toEqual([]));
  it('text inside an engine text edit is text', () =>
    expect(classifyMutation({ type: 'characterData', attributeName: null, oldValue: 'a', newValue: null, inTextEdit: true })).toEqual(['text']));
  it('text changes outside an edit are ignored', () =>
    expect(classifyMutation({ type: 'childList', attributeName: null, oldValue: null, newValue: null, inTextEdit: false })).toEqual([]));
});
