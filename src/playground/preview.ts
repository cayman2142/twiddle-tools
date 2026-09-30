/** A numbered element entry in a Copy changes payload ("1. card"). */
const ENTRY = /^\d+\. /;

export function hasChanges(text: string): boolean {
  return text.split(/\r?\n/).some((line) => ENTRY.test(line));
}

/* The payload opens with a how-to block for the agent. The finish card shows
 * the title and the entries — the part that is about what the visitor did. */
export function agentPreview(text: string, max = 14): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const first = lines.findIndex((line) => ENTRY.test(line));
  const body = first > 0 ? [lines[0], '', ...lines.slice(first)] : lines;
  if (body.length <= max) return body.join('\n');
  const rest = body.length - max;
  return [...body.slice(0, max), `… ${rest} more line${rest === 1 ? '' : 's'} in your clipboard`].join('\n');
}
