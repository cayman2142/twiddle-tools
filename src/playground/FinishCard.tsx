import { useLayoutEffect, useRef } from 'react';
import { CtaButton } from '../marketing/CtaButton';
import { HighlightedPayload } from '../marketing/HighlightedPayload';
import type { CopyResult } from './bridge';
import { agentPreview, hasChanges } from './preview';

export function FinishCard({ copy, onClose }: { copy: CopyResult; onClose(): void }) {
  const headRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    headRef.current?.focus();
  }, [copy]);

  const empty = copy.kind === 'changes' && !hasChanges(copy.text);
  const title = empty
    ? 'Nothing changed yet'
    : copy.kind === 'changes'
      ? 'This is what your agent gets'
      : 'You copied the whole block as a brief';

  return (
    <>
      {/* Mouse-only dismiss; keyboard users have Keep playing and Escape. */}
      <button type="button" className="playground-scrim" aria-hidden="true" tabIndex={-1} onClick={onClose} />
      <div
        className="playground-finish"
        role="dialog"
        aria-labelledby="playground-finish-title"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose();
        }}
      >
        <h3 id="playground-finish-title" ref={headRef} tabIndex={-1}>
          {title}
        </h3>
        {empty ? (
          <p className="playground-finish__note">Tweak something, then copy.</p>
        ) : (
          <>
            <pre>
              <HighlightedPayload text={agentPreview(copy.text)} />
            </pre>
            <p className="playground-finish__note">
              Already in your clipboard — paste it into Claude Code, Cursor, anything. On your own site, twiddle writes the
              same thing.
            </p>
          </>
        )}
        <div className="playground-finish__actions">
          <CtaButton size="hero" />
          <button type="button" className="site-ghost" onClick={onClose}>
            Keep playing
          </button>
        </div>
      </div>
    </>
  );
}
