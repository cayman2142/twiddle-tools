import { Check, RotateCcw } from 'lucide-react';
import { TASKS, type Done } from './tasks';

export function Checklist({ done, onReset }: { done: Done; onReset(): void }) {
  const count = TASKS.filter((task) => done[task.id]).length;
  return (
    <div className="playground-tasks">
      <p className="playground-tasks__lead">
        <strong>Try the real thing.</strong> This is twiddle, running on a sample page.
      </p>
      <ol className="playground-tasks__list">
        {TASKS.map((task) => (
          <li key={task.id} className="playground-task" data-task={task.id} data-done={done[task.id] ? 'true' : undefined}>
            <span className="playground-task__box" aria-hidden="true">
              {done[task.id] ? <Check size={12} strokeWidth={3} /> : null}
            </span>
            {task.label}
          </li>
        ))}
      </ol>
      <p className="playground-sr" aria-live="polite">
        {count} of {TASKS.length} done
      </p>
      <button type="button" className="playground-tasks__reset" onClick={onReset}>
        <RotateCcw size={14} strokeWidth={2.25} aria-hidden="true" />
        Reset
      </button>
    </div>
  );
}
