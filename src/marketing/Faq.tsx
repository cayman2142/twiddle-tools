import { Thiing } from './Thiing';

const ITEMS = [
  {
    icon: 'laptop',
    title: 'Where does it run?',
    body: 'Chrome, on any ordinary live page — localhost, preview, or production.',
  },
  {
    icon: 'robot',
    title: 'Which agent?',
    body: 'Any agent via the clipboard. twiddle does not need a bridge or an MCP config.',
  },
  {
    icon: 'clipboard',
    title: 'Is it free?',
    body: 'Free while we test. A paid plan comes later; anyone who installs during beta keeps an early-supporter discount.',
  },
];

export function Faq() {
  return (
    <section className="site-section" id="faq">
      <div className="site-section__head">
        <p className="site-kicker">Install</p>
        <h2>Chrome. Any ordinary site. Any agent.</h2>
        <p className="site-section__body">
          No repo, no localhost lock-in, no setup. Copy the change and paste it into the agent you already use.
        </p>
      </div>
      <div className="site-faq">
        {ITEMS.map((item) => (
          <div className="site-faq__item" key={item.title}>
            <Thiing name={item.icon} alt="" size="lg" />
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
