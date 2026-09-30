export type TaskId = 'space' | 'colour' | 'text' | 'copy';
export type Done = Record<TaskId, boolean>;

export const NONE: Done = { space: false, colour: false, text: false, copy: false };

export const TASKS: readonly { id: TaskId; label: string }[] = [
  { id: 'space', label: 'Change spacing or radius' },
  { id: 'colour', label: 'Recolour something' },
  { id: 'text', label: 'Edit a line of text' },
  { id: 'copy', label: 'Copy your changes for an agent' },
];

/** The first task not yet done, in checklist order. */
export function nextTask(done: Done): TaskId | null {
  return TASKS.find((task) => !done[task.id])?.id ?? null;
}
