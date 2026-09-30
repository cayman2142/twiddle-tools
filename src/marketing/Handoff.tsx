import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ChangesPanel } from '../chrome/Panel';
import { HighlightedPayload } from './HighlightedPayload';
import { Thiing } from './Thiing';

const ROWS = [
  { name: 'padding', value: 'var(--space-4) var(--space-6)', title: '11px 22px → var(--space-4) var(--space-6)' },
  { name: 'background-color', value: 'var(--color-brand)', title: '#0f766e → var(--color-brand)' },
];

/* Same shape as the extension's Copy changes output (tests/golden/copy-changes.txt
 * in the product repo), trimmed to the lines that matter on a landing page. */
const PAYLOAD = `Twiddle — 2 changes on 1 element
Current values are on the left, the values I want are on the right.

Agent — how to apply:
- Locate each element by priority: id → classes → visible text → dom_path.
- dom_path is a runtime locator only — never copy it into source as a CSS selector.
- Prefer editing an existing rule, utility class, or design token that already
  styles those classes.
- Apply ONLY the listed properties. Keep the project's CSS architecture and naming.

1. button
   classes:  cta
   text:     "Get started"
   size:     134×52
   dom_path: main > section.hero > button.cta  (runtime only — not a source selector)
   padding: 11px 22px → var(--space-4) var(--space-6)
   background-color: #0f766e → var(--color-brand)`;

export function Handoff() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PAYLOAD);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="site-band" id="handoff">
      <div className="site-section">
        <div className="site-section__head">
          <div className="site-section__kicker-row">
            <Thiing name="clipboard" alt="" size="md" />
            <p className="site-kicker">Copy changes</p>
          </div>
          <h2>Your agent gets was → want. Not a screenshot.</h2>
          <p className="site-section__body">
            One click puts plain text on your clipboard: which element, the values it had, the values you set, and how to
            apply them without inventing new CSS. Paste it into the agent you already use.
          </p>
        </div>
        <div className="handoff">
          <div className="handoff__panel" aria-hidden="true">
            <ChangesPanel rows={ROWS} />
          </div>
          <figure className="handoff__payload">
            <figcaption>
              <span>Clipboard</span>
              <button type="button" className="handoff__copy" onClick={copy}>
                {copied ? <Check size={14} strokeWidth={2.25} aria-hidden="true" /> : <Copy size={14} strokeWidth={2.25} aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy sample'}
              </button>
            </figcaption>
            <pre>
              <HighlightedPayload text={PAYLOAD} />
            </pre>
          </figure>
        </div>
      </div>
    </section>
  );
}
