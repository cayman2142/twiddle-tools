import type { ReactNode } from 'react';
import { Nav } from './Nav';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <div className="site-frame">
        <Nav />
        {children}
      </div>
    </div>
  );
}
