import { Thiing } from './Thiing';

const STEPS = [
  {
    icon: 'laptop',
    title: 'Turn it on',
    body: 'Click the twiddle icon on any tab — localhost, a preview deploy, or production. Nothing to install in your project.',
  },
  {
    icon: 'inspect',
    title: 'Pin what’s off',
    body: 'Hover to see padding, margin, and size. Click to pin the element and read its tokens.',
  },
  {
    icon: 'paintbrush',
    title: 'Tweak it by hand',
    body: 'Change spacing, color, size, and layout in a Figma-style panel. The page updates as you go.',
  },
  {
    icon: 'clipboard',
    title: 'Copy changes',
    body: 'One click. Your agent gets the element and was → want in the page’s own tokens — not a guess.',
  },
];

export function HowItWorks() {
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
        <ol className="site-steps">
          {STEPS.map((step, index) => (
            <li className="site-steps__item" key={step.title}>
              <span className="site-steps__num">{index + 1}</span>
              <Thiing name={step.icon} alt="" size="lg" />
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
