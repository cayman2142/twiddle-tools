import { classifyMutation, type ChangeKind } from './classify';
import { copyKindOf, type CopyKind } from './copyKind';
import type { Box } from './placement';

/* The only code that reaches into the playground iframe. The iframe is same
 * origin, so the site can read its DOM and wrap its clipboard without the
 * product knowing. Selectors below target the vendored engine's own markup
 * (public/playground/engine/VERSION); re-run tests/e2e after refreshing it. */

export type CopyResult = { kind: CopyKind; text: string };

export type BridgeEvents = {
  onReady(): void;
  onFail(reason: 'no-load' | 'no-engine'): void;
  onPower(on: boolean): void;
  onChange(kind: ChangeKind): void;
  onCopy(result: CopyResult): void;
};

export type Bridge = {
  /** The first on-screen match inside the iframe, in iframe-viewport coordinates. */
  rectOf(selector: string): Box | null;
  viewport(): { width: number; height: number };
  turnOn(): void;
  dispose(): void;
};

type TwiddleApi = { on(): void; isOn(): boolean; selectionCount(): number };
type ForgeWindow = Window & typeof globalThis & { Twiddle?: TwiddleApi };

/** The engine's own chrome (panel, toolbar, overlays) — never counted as page edits. */
export const CHROME_SEL = '[data-sl-chrome], [data-sl-ignore]';
/** Marks the element under the engine's hover/focus/disabled state preview, whose inline paint is not an edit. */
const STATE_ATTR = 'data-sl-live-state';
const STATE_PREVIEW_SEL = `[${STATE_ATTR}]`;
const CONTROL_SEL = 'button, [role="menuitem"], [role="menuitemradio"]';

const LOAD_TIMEOUT_MS = 30_000;
const ENGINE_TIMEOUT_MS = 8_000;
const CONTROL_TTL_MS = 3_000;
const DUPLICATE_MS = 800;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function selectedText(doc: Document): string {
  const el = doc.activeElement as HTMLTextAreaElement | null;
  if (el && typeof el.value === 'string' && typeof el.selectionStart === 'number') {
    return el.value.slice(el.selectionStart, el.selectionEnd ?? el.value.length);
  }
  return doc.getSelection()?.toString() ?? '';
}

export function connectBridge(frame: HTMLIFrameElement, events: BridgeEvents): Bridge {
  let disposed = false;
  let win: ForgeWindow | null = null;
  const cleanups: (() => void)[] = [];

  const fail = (reason: 'no-load' | 'no-engine') => {
    if (!disposed) events.onFail(reason);
  };

  const loadTimer = window.setTimeout(() => {
    if (!win) fail('no-load');
  }, LOAD_TIMEOUT_MS);
  cleanups.push(() => window.clearTimeout(loadTimer));

  const viewport = () => ({ width: frame.clientWidth, height: frame.clientHeight });

  async function enterEdit(doc: Document) {
    const btn = doc.querySelector<HTMLElement>('[aria-label="Edit mode"]');
    if (btn && btn.getAttribute('aria-pressed') !== 'true') btn.click();
    await wait(200);
  }

  /** Pin the sign-in card the way a person would: a click just inside its left edge. */
  async function pinCard(w: ForgeWindow) {
    const card = w.document.querySelector('section.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = r.left + 6;
    const y = r.top + r.height / 2;
    const target = w.document.elementFromPoint(x, y);
    if (!target) return;
    const fire = (type: string, buttons: number) => {
      const init: PointerEventInit = {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: x,
        clientY: y,
        button: 0,
        buttons,
        view: w,
        pointerId: 1,
        isPrimary: true,
        pointerType: 'mouse',
      };
      target.dispatchEvent(type.startsWith('pointer') ? new w.PointerEvent(type, init) : new w.MouseEvent(type, init));
    };
    for (const [type, buttons] of [
      ['pointermove', 0],
      ['mousemove', 0],
      ['pointerdown', 1],
      ['mousedown', 1],
      ['pointerup', 0],
      ['mouseup', 0],
      ['click', 0],
    ] as const) {
      fire(type, buttons);
      await wait(30);
    }
    await wait(300);
  }

  function instrument(w: ForgeWindow) {
    const doc = w.document;

    const root = doc.querySelector('.app') ?? doc.body;
    const observer = new w.MutationObserver((records) => {
      // The engine restores paint before dropping the marker when a preview
      // ends, so by now the marker may be gone: skip the whole batch around it.
      const toggled = records.filter((rec) => rec.attributeName === STATE_ATTR).map((rec) => rec.target);
      for (const rec of records) {
        if (rec.attributeName === STATE_ATTR) continue;
        const el = rec.target.nodeType === 1 ? (rec.target as Element) : rec.target.parentElement;
        if (!el || el.closest(CHROME_SEL) || el.closest(STATE_PREVIEW_SEL)) continue;
        if (toggled.some((node) => node.contains(el))) continue;
        const kinds = classifyMutation({
          type: rec.type,
          attributeName: rec.attributeName,
          oldValue: rec.oldValue,
          newValue: rec.type === 'attributes' ? el.getAttribute('style') : null,
          inTextEdit: !!el.closest('.sl-text-editing'),
        });
        for (const kind of kinds) events.onChange(kind);
      }
    });
    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ['style', STATE_ATTR],
      attributeOldValue: true,
      characterData: true,
      childList: true,
    });
    cleanups.push(() => observer.disconnect());

    // Which control started the next clipboard write. Not filtered to chrome:
    // copyKindOf only matches the engine's own copy controls, and a stray page
    // button just reads as `block`, the safe default.
    let control: Element | null = null;
    let controlAt = 0;
    const noteControl = (event: Event) => {
      if (!(event.target instanceof w.Element)) return;
      const btn = event.target.closest(CONTROL_SEL);
      if (btn) {
        control = btn;
        controlAt = Date.now();
      }
    };
    doc.addEventListener('pointerdown', noteControl, true);
    doc.addEventListener('click', noteControl, true);
    cleanups.push(() => {
      doc.removeEventListener('pointerdown', noteControl, true);
      doc.removeEventListener('click', noteControl, true);
    });

    let lastText = '';
    let lastAt = 0;
    const report = (text: string) => {
      if (disposed || !text) return;
      const now = Date.now();
      // The engine falls back from writeText to execCommand; one copy, one event.
      if (text === lastText && now - lastAt < DUPLICATE_MS) return;
      lastText = text;
      lastAt = now;
      events.onCopy({ kind: copyKindOf(now - controlAt < CONTROL_TTL_MS ? control : null), text });
    };

    const clip = w.navigator.clipboard;
    if (clip && typeof clip.writeText === 'function') {
      const original = clip.writeText;
      clip.writeText = function writeText(text: string) {
        report(String(text));
        return original.call(clip, text);
      };
      cleanups.push(() => {
        Reflect.deleteProperty(clip, 'writeText');
      });
    }

    const originalExec = doc.execCommand;
    doc.execCommand = function execCommand(commandId: string, showUI?: boolean, value?: string) {
      if (commandId.toLowerCase() === 'copy') report(selectedText(doc));
      return originalExec.call(doc, commandId, showUI, value);
    };
    cleanups.push(() => {
      Reflect.deleteProperty(doc, 'execCommand');
    });
  }

  function watchPower(api: TwiddleApi) {
    let on = true;
    const id = window.setInterval(() => {
      const now = api.isOn();
      if (now !== on) {
        on = now;
        events.onPower(now);
      }
    }, 500);
    cleanups.push(() => window.clearInterval(id));
  }

  async function start(w: ForgeWindow, api: TwiddleApi) {
    instrument(w);
    await enterEdit(w.document);
    await pinCard(w);
    if (disposed) return;
    events.onReady();
    watchPower(api);
  }

  function onLoad() {
    const w = frame.contentWindow as ForgeWindow | null;
    if (!w || disposed || win) return;
    win = w;
    const started = Date.now();
    const poll = window.setInterval(() => {
      if (disposed) return;
      const api = w.Twiddle;
      if (api && api.isOn()) {
        window.clearInterval(poll);
        void start(w, api);
      } else if (Date.now() - started > ENGINE_TIMEOUT_MS) {
        window.clearInterval(poll);
        fail('no-engine');
      }
    }, 100);
    cleanups.push(() => window.clearInterval(poll));
  }

  frame.addEventListener('load', onLoad);
  cleanups.push(() => frame.removeEventListener('load', onLoad));
  if (frame.contentDocument?.readyState === 'complete' && frame.contentWindow?.location.pathname.endsWith('/forge.html')) {
    onLoad();
  }

  return {
    rectOf(selector) {
      const doc = win?.document;
      if (!doc) return null;
      const el = doc.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const view = viewport();
      if (r.width === 0 && r.height === 0) return null;
      if (r.bottom <= 0 || r.top >= view.height || r.right <= 0 || r.left >= view.width) return null;
      // A row scrolled out of the panel's own scroller is not on screen either.
      const panel = el.closest('.sl-panel');
      if (panel && panel !== el) {
        const p = panel.getBoundingClientRect();
        if (r.top < p.top || r.bottom > p.bottom) return null;
      }
      return { left: r.left, top: r.top, width: r.width, height: r.height };
    },
    viewport,
    turnOn() {
      const api = win?.Twiddle;
      if (!win || !api) return;
      api.on();
      void enterEdit(win.document);
    },
    dispose() {
      disposed = true;
      for (const cleanup of cleanups.reverse()) cleanup();
    },
  };
}
