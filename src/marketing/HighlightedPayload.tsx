/* Colours the "prop: was → want" lines of a Copy changes payload. */
export function HighlightedPayload({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, index) => {
        const arrow = line.indexOf(' → ');
        const isChange = /^ {3}[a-z-]+: /.test(line) && arrow > 0 && !line.includes('dom_path');
        if (!isChange) return <span key={index}>{line + '\n'}</span>;
        const colon = line.indexOf(': ');
        return (
          <span key={index} className="handoff__change">
            {line.slice(0, colon + 2)}
            <span className="handoff__was">{line.slice(colon + 2, arrow)}</span>
            {' → '}
            <span className="handoff__want">{line.slice(arrow + 3)}</span>
            {'\n'}
          </span>
        );
      })}
    </>
  );
}
