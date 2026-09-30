import type { CSSProperties, ReactNode } from 'react';
import { Lock } from 'lucide-react';

type Props = {
  url: string;
  hint?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/* A browser window around every staged demo: the product runs on live pages in
 * Chrome, so the demo should read as "a page in a tab", not as an app mockup. */
export function StageFrame({ url, hint, className, style, children }: Props) {
  return (
    <div className={`scene-stage${className ? ` ${className}` : ''}`} style={style}>
      <div className="stage-bar" aria-hidden="true">
        <span className="stage-bar__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="stage-bar__url">
          <Lock size={12} strokeWidth={2.25} />
          {url}
        </span>
        <span className="stage-bar__ext" title="twiddle is on">
          <img src="/logo-icon.svg" alt="" width="20" height="20" />
        </span>
      </div>
      {hint ? <p className="stage-hint">{hint}</p> : null}
      <div className="scene-stage__view">{children}</div>
    </div>
  );
}
