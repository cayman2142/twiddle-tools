import type { ReactNode } from 'react';

const ITEMS: { q: string; a: ReactNode }[] = [
  {
    q: 'Where does it run?',
    a: 'In Chrome, on any ordinary page — localhost, a preview deploy, or production. No repo access, no build plugin, no setup.',
  },
  {
    q: 'Which agent does it work with?',
    a: 'Any of them. Copy changes puts plain text on your clipboard, so it pastes into whatever chat or coding agent you already use. There is no bridge or MCP config to set up.',
  },
  {
    q: 'Does it change the real site?',
    a: 'No. Your edits only live in your tab and are gone when you reload. The site changes when your agent applies the diff to your code.',
  },
  {
    q: 'Do I need a design system?',
    a: 'No. If the page defines CSS variables, twiddle shows which ones a value uses and flags values that are off the scale. If it does not, you still get exact values.',
  },
  {
    q: 'Does it upload my page?',
    a: (
      <>
        No. Inspecting, editing, and Adaptive run in your browser. The only thing that ever leaves it is feedback you
        choose to send. <a href="/privacy">Privacy policy</a>
      </>
    ),
  },
  {
    q: 'Is it free?',
    a: 'Free while we test. A paid plan comes later; anyone who installs during beta keeps an early-supporter discount.',
  },
];

export function Faq() {
  return (
    <section className="site-band" id="faq">
      <div className="site-section">
        <div className="site-section__head site-section__head--center">
          <p className="site-kicker">FAQ</p>
          <h2>Chrome. Any ordinary site. Any agent.</h2>
        </div>
        <div className="site-faq">
          {ITEMS.map((item) => (
            <details className="site-faq__item" key={item.q}>
              <summary>
                <h3>{item.q}</h3>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
