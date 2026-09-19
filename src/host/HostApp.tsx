import type { ReactNode } from 'react';
import { Hatch, Outline, SizeChip } from '../chrome/Hatch';
import './host.css';

export type HostPin = 'cta' | 'login' | 'card' | null;

export type HostTweaks = {
  ctaPadding?: 'off' | 'token' | 'default';
  loginEdited?: boolean;
  duplicatedCard?: boolean;
  hatch?: boolean;
  sizeLabel?: string;
};

export type HostProps = {
  width?: 'desktop' | 'phone';
  pinned?: HostPin;
  tweaks?: HostTweaks;
};

function Pin({
  id,
  pinned,
  hatch,
  sizeLabel,
  children,
}: {
  id: Exclude<HostPin, null>;
  pinned?: HostPin;
  hatch?: boolean;
  sizeLabel?: string;
  children: ReactNode;
}) {
  if (pinned !== id) return <>{children}</>;
  return (
    <div className="host-pin">
      <Outline />
      {hatch ? <Hatch value={sizeLabel?.replace(/\D.*/, '') || '16'} /> : null}
      {sizeLabel ? <SizeChip label={sizeLabel} /> : null}
      {children}
    </div>
  );
}

const CARDS = [
  { title: 'Inbox', body: '12 threads waiting on a reply.' },
  { title: 'Pipeline', body: 'Four deals moved this week.' },
  { title: 'Team', body: 'Maya joined billing last Tuesday.' },
];

export function HostApp({ width = 'desktop', pinned = null, tweaks = {} }: HostProps) {
  const ctaClass = [
    'host-cta',
    tweaks.ctaPadding === 'off' ? 'is-off-scale' : '',
    tweaks.ctaPadding === 'token' ? 'is-token' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`host-app${width === 'phone' ? ' host-app--phone' : ''}`}>
      <aside className="host-app__side">
        <p className="host-app__brand">Relay</p>
        <nav className="host-app__nav" aria-label="Relay">
          <button type="button" className="is-on" tabIndex={-1}>
            Home
          </button>
          <button type="button" tabIndex={-1}>
            Projects
          </button>
          <button type="button" tabIndex={-1}>
            Settings
          </button>
        </nav>
      </aside>
      <div className="host-app__main">
        <section className="host-app__hero">
          <h2>Ship the next release without another screenshot thread.</h2>
          <p>A calm workspace for inbox, pipeline, and the people who close the loop.</p>
          <Pin id="cta" pinned={pinned} hatch={tweaks.hatch} sizeLabel={tweaks.sizeLabel}>
            <button type="button" className={ctaClass} tabIndex={-1}>
              Get started
            </button>
          </Pin>
        </section>
        <Pin id="login" pinned={pinned} hatch={tweaks.hatch} sizeLabel={tweaks.sizeLabel}>
          <form className={`host-login${tweaks.loginEdited ? ' is-edited' : ''}`} onSubmit={(event) => event.preventDefault()}>
            <h3>Sign in</h3>
            <label>
              Email
              <input type="email" defaultValue="maya@relay.app" readOnly />
            </label>
            <label>
              Password
              <input type="password" defaultValue="········" readOnly />
            </label>
            <button type="button" className="host-login__submit" tabIndex={-1}>
              Continue
            </button>
          </form>
        </Pin>
        <div className="host-cards">
          {CARDS.map((card, index) => {
            const node = (
              <article className={`host-card${tweaks.duplicatedCard && index === 1 ? ' is-duplicate' : ''}`} key={card.title}>
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </article>
            );
            if (index !== 1) return node;
            return (
              <Pin key={card.title} id="card" pinned={pinned} hatch={tweaks.hatch} sizeLabel={tweaks.sizeLabel}>
                {node}
              </Pin>
            );
          })}
          {tweaks.duplicatedCard ? (
            <article className="host-card is-duplicate">
              <strong>Pipeline</strong>
              <p>Four deals moved this week.</p>
            </article>
          ) : null}
        </div>
      </div>
    </div>
  );
}
