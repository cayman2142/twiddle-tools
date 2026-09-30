import { useRef } from 'react';
import { StepScene } from './steps/StepScene';
import { SCENE_MS } from './steps/timing';
import { useStepPlayback } from './steps/useStepPlayback';

const STEPS = [
  {
    title: 'Turn it on',
    body: 'Click the twiddle icon on any tab — localhost, a preview deploy, or production. Nothing to install in your project.',
  },
  {
    title: 'Pin what’s off',
    body: 'Hover to see padding, margin, and size. Click to pin the element and read its tokens.',
  },
  {
    title: 'Tweak it by hand',
    body: 'Change spacing, color, size, and layout in a Figma-style panel. The page updates as you go.',
  },
  {
    title: 'Copy changes',
    body: 'One click. Your agent gets the element and was → want in the page’s own tokens — not a guess.',
  },
];

export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const { active, play, enter, leave } = useStepPlayback(listRef, SCENE_MS);

  return (
    <section className="site-band" id="how">
      <div className="site-section">
        <div className="site-section__head site-section__head--center">
          <p className="site-kicker">How it works</p>
          <h2>Four steps. The exact change.</h2>
          <p className="site-section__body">
            The agent built the page. You can see what is off. Explaining it in screenshots takes longer than fixing
            it — so fix it on the page, and hand over the diff.
          </p>
        </div>
        <ol className="site-steps" ref={listRef}>
          {STEPS.map((step, index) => {
            const on = index === active;
            return (
              // Focusable so keyboard users can pick a step to play, as hover does.
              <li
                className="site-steps__item"
                key={step.title}
                data-step={index + 1}
                data-active={on || undefined}
                tabIndex={0}
                onMouseEnter={() => enter(index, 'hover')}
                onMouseLeave={() => leave(index, 'hover')}
                onFocus={() => enter(index, 'focus')}
                onBlur={() => leave(index, 'focus')}
              >
                <StepScene step={index + 1} playing={on} playKey={on ? play : 'rest'} />
                <div className="site-steps__text">
                  <span className="site-steps__num">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
