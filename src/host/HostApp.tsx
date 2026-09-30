import type { ReactNode } from 'react';
import { ArrowRight, FolderKanban, House, Inbox, Kanban, Lock, Mail, Menu, Radio, Settings, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Hatch, Outline, SizeChip } from '../chrome/Hatch';
import './host.css';

export type HostPin = 'cta' | 'login' | 'card' | null;

export type HostTweaks = {
  ctaPadding?: 'off' | 'token' | 'default';
  loginPadding?: 16 | 24;
  duplicatedCard?: boolean;
  /** Hatch band thickness in px; omit for no hatch. */
  hatch?: number;
  sizeLabel?: string;
};

export type HostProps = {
  pinned?: HostPin;
  tweaks?: HostTweaks;
  /** Drop the three cards on narrow stages unless the scene is about them. */
  compact?: boolean;
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
  hatch?: number;
  sizeLabel?: string;
  children: ReactNode;
}) {
  if (pinned !== id) return <>{children}</>;
  return (
    <div className={`host-pin host-pin--${id}`}>
      {sizeLabel ? <SizeChip label={sizeLabel} /> : null}
      <div className="host-pin__box">
        <Outline />
        {hatch ? <Hatch size={hatch} /> : null}
        {children}
      </div>
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

/* "Relay" — a made-up app standing in for the page under inspection. It has its
 * own --color-* / --space-* tokens and reflows by container width, so the
 * Adaptive scene shows real layout changes rather than a drawing of them. */
export function HostApp({ pinned = null, tweaks = {}, compact = false }: HostProps) {
  const ctaClass = [
    'host-cta',
    tweaks.ctaPadding === 'off' ? 'is-off-scale' : '',
    tweaks.ctaPadding === 'token' ? 'is-token' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const dropCards = compact && pinned !== 'card' && !tweaks.duplicatedCard;

  return (
    <div className={`host-app${dropCards ? ' host-app--compact' : ''}`}>
      <header className="host-app__top">
        <p className="host-app__brand">
          <Radio size={16} strokeWidth={2} aria-hidden="true" />
          Relay
        </p>
        <nav className="host-app__nav" aria-label="Relay">
          {NAV.map(({ label, icon: Glyph, on }) => (
            <span className={on ? 'host-app__nav-btn is-current' : 'host-app__nav-btn'} key={label}>
              <Glyph size={16} strokeWidth={2} aria-hidden="true" />
              {label}
            </span>
          ))}
        </nav>
        <span className="host-app__burger">
          <Menu size={18} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="host-app__me">M</span>
      </header>
      <div className="host-app__main">
        <div className="host-app__grid">
          <section className="host-app__hero">
            <h2>Ship the next release without another screenshot thread.</h2>
            <p>A calm workspace for inbox, pipeline, and the people who close the loop.</p>
            <Pin id="cta" pinned={pinned} hatch={tweaks.hatch} sizeLabel={tweaks.sizeLabel}>
              <span className={ctaClass}>Get started</span>
            </Pin>
          </section>
          <Pin id="login" pinned={pinned} hatch={tweaks.hatch} sizeLabel={tweaks.sizeLabel}>
            <div className="host-login" style={{ padding: tweaks.loginPadding ?? 24 }}>
              <h3>Sign in</h3>
              <div className="host-login__label">
                Email
                <span className="host-login__field">
                  <Mail className="host-login__glyph" size={16} strokeWidth={2} aria-hidden="true" />
                  maya@relay.app
                </span>
              </div>
              <div className="host-login__label">
                Password
                <span className="host-login__field">
                  <Lock className="host-login__glyph" size={16} strokeWidth={2} aria-hidden="true" />
                  ••••••••
                </span>
              </div>
              <span className="host-login__submit">
                Continue
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            </div>
          </Pin>
          <div className="host-cards">
            {CARDS.map((card, index) => {
              const node = <Card key={card.title} {...card} />;
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
    </div>
  );
}
