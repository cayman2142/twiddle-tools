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
        <div>
          <h3>Where does it run?</h3>
          <p>Chrome, on any ordinary live page — localhost, preview, or production.</p>
        </div>
        <div>
          <h3>Which agent?</h3>
          <p>Any agent via the clipboard. Twiddle does not need a bridge or an MCP config.</p>
        </div>
        <div>
          <h3>Is it free?</h3>
          <p>Free while we test. A paid plan comes later; anyone who installs during beta keeps an early-supporter discount.</p>
        </div>
      </div>
    </section>
  );
}
