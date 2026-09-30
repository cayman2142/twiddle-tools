import { describe, expect, it } from 'vitest';
import { agentPreview, hasChanges } from './preview';

const PAYLOAD = [
  'Twiddle — 2 changes on 2 elements',
  'Current values are on the left, the values I want are on the right.',
  '',
  'Agent — how to apply:',
  '- Locate each element by priority: id → classes → visible text → dom_path.',
  '- Apply ONLY the listed properties.',
  '',
  '1. #auth-title',
  '   text: "Welcome back" → "Hello there"',
  '',
  '2. card',
  '   classes:  card',
  '   background-color: rgba(255, 255, 255, 0.92) → rgba(253, 230, 138, 0.92)',
].join('\n');

describe('agentPreview', () => {
  it('keeps the title and the entries, drops the how-to block', () =>
    expect(agentPreview(PAYLOAD)).toBe(
      [
        'Twiddle — 2 changes on 2 elements',
        '',
        '1. #auth-title',
        '   text: "Welcome back" → "Hello there"',
        '',
        '2. card',
        '   classes:  card',
        '   background-color: rgba(255, 255, 255, 0.92) → rgba(253, 230, 138, 0.92)',
      ].join('\n'),
    ));
  it('says how much it cut', () =>
    expect(agentPreview(PAYLOAD, 4)).toBe(
      ['Twiddle — 2 changes on 2 elements', '', '1. #auth-title', '   text: "Welcome back" → "Hello there"', '… 4 more lines in your clipboard'].join('\n'),
    ));
  it('uses the singular for one line', () => expect(agentPreview('a\nb\nc', 2)).toBe('a\nb\n… 1 more line in your clipboard'));
  it('normalises CRLF', () => expect(agentPreview('x\r\n1. y')).toBe('x\n\n1. y'));
});

describe('hasChanges', () => {
  it('sees numbered entries', () => expect(hasChanges(PAYLOAD)).toBe(true));
  it('is false for an empty diff', () => expect(hasChanges('Twiddle — 0 changes')).toBe(false));
});
