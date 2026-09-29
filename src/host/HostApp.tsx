import type { ReactNode } from 'react';
import { ArrowRight, FolderKanban, House, Inbox, Kanban, Lock, Mail, Radio, Settings, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
    <div className={`host-pin host-pin--${id}`}>
      <Outline />
      {hatch ? <Hatch value="16" /> : null}
      {sizeLabel ? <SizeChip label={sizeLabel} /> : null}
      {children}
    </div>
  );
}

const NAV: { label: string; icon: LucideIcon; on?: boolean }[] = [
  { label: 'Home', icon: House, on: true },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Settings', icon: Settings },
];

const CARDS: { title: string; body: string; icon: LucideIcon }[] = [
  { title: 'Inbox', body: '12 threads waiting on a reply.', icon: Inbox },
  { title: 'Pipeline', body: 'Four deals moved this week.', icon: Kanban },
  { title: 'Team', body: 'Maya joined billing last Tuesday.', icon: Users },
];

function Card({ title, body, icon: Glyph, duplicate = false }: { title: string; body: string; icon: LucideIcon; duplicate?: boolean }) {
  return (
    <article className={`host-card${duplicate ? ' is-duplicate' : ''}`}>
      <div className="host-card__top">
        <span className="host-card__icon" aria-hidden="true">
          <Glyph size={16} strokeWidth={2} />
        </span>
        <strong>{title}</strong>
      </div>
      <p>{body}</p>
    </article>
  );
}

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
        <p className="host-app__brand">
          <Radio size={16} strokeWidth={2} aria-hidden="true" />
          Relay
        </p>
        <nav className="host-app__nav" aria-label="Relay">
          {NAV.map(({ label, icon: Glyph, on }) => (
            <button type="button" className={on ? 'host-app__nav-btn is-current' : 'host-app__nav-btn'} tabIndex={-1} key={label}>
              <Glyph size={16} strokeWidth={2} aria-hidden="true" />
              {label}
            </button>
          ))}
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
              <span className="host-login__field">
                <Mail className="host-login__glyph" size={16} strokeWidth={2} aria-hidden="true" />
                <input type="email" defaultValue="maya@relay.app" readOnly />
              </span>
            </label>
            <label>
              Password
              <span className="host-login__field">
                <Lock className="host-login__glyph" size={16} strokeWidth={2} aria-hidden="true" />
                <input type="password" defaultValue="········" readOnly />
              </span>
            </label>
            <button type="button" className="host-login__submit" tabIndex={-1}>
              Continue
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </form>
        </Pin>
        <div className="host-cards">
          {CARDS.map((card, index) => {
            const node = <Card key={card.title} {...card} duplicate={tweaks.duplicatedCard && index === 1} />;
            if (index !== 1) return node;
            return (
              <Pin key={card.title} id="card" pinned={pinned} hatch={tweaks.hatch} sizeLabel={tweaks.sizeLabel}>
                {node}
              </Pin>
            );
          })}
          {tweaks.duplicatedCard ? <Card {...CARDS[1]} duplicate /> : null}
        </div>
      </div>
    </div>
  );
}
