type WingProps = {
  className: string;
};

function Wing({ className, d }: WingProps & { d: string }) {
  return (
    <svg
      className={`site-wing ${className}`}
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      shapeRendering="geometricPrecision"
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}

export function NotchLeftWing() {
  return <Wing className="site-wing--left" d="M 0 0 C 11.046 0 20 8.954 20 20 H 28 V -8 H 0 Z" />;
}

export function NotchRightWing() {
  return <Wing className="site-wing--right" d="M 20 0 C 8.954 0 0 8.954 0 20 H -8 V -8 H 20 Z" />;
}

export function NotchCornerLeftWing() {
  return <Wing className="site-wing--corner-left" d="M 0 0 H 20 C 8.954 0 0 8.954 0 20 V 0 Z" />;
}

export function NotchCornerRightWing() {
  return <Wing className="site-wing--corner-right" d="M 20 0 H 0 C 11.046 0 20 8.954 20 20 V 0 Z" />;
}
