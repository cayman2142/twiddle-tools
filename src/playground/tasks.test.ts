import { describe, expect, it } from 'vitest';
import { NONE, TASKS, nextTask } from './tasks';

describe('nextTask', () => {
  it('starts with spacing', () => expect(nextTask(NONE)).toBe('space'));
  it('skips done tasks in order', () => expect(nextTask({ ...NONE, space: true })).toBe('colour'));
  it('returns the first gap, not the last', () =>
    expect(nextTask({ space: true, colour: true, text: false, copy: true })).toBe('text'));
  it('is null when everything is done', () =>
    expect(nextTask({ space: true, colour: true, text: true, copy: true })).toBeNull());
  it('lists four tasks ending with copy', () => expect(TASKS.map((t) => t.id)).toEqual(['space', 'colour', 'text', 'copy']));
});
