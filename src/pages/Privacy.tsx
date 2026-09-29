import { SiteShell } from '../marketing/SiteShell';

export function Privacy() {
  return (
    <SiteShell>
      <main className="site-doc">
        <h1>Twiddle Privacy Policy</h1>
        <p className="site-meta">
          Effective: 19 September 2026
          <br />
          Product: Twiddle Chrome extension (build 0.1.6)
          <br />
          Controller: Artem Pirog
          <br />
          Contact: <a href="mailto:caymnjke@gmail.com">caymnjke@gmail.com</a>
        </p>
        <p>
          This policy describes how Twiddle handles data today. It is written for Chrome Web Store review and for people who
          send feedback.
        </p>

        <h2>1. What Twiddle is</h2>
        <p>
          Twiddle helps a designer or product person inspect visual properties and design tokens on a live page, make
          temporary visual or structural edits, preview responsive layouts, and copy a handoff. It is not a page saver, it
          has no account system in this build, and it does not download or execute remote code.
        </p>

        <h2>2. What we do not collect</h2>
        <p>
          Twiddle does not run analytics, ads, crash telemetry, or account sync in this build. Inspect, edit, token
          analysis, Adaptive preview, copied handoffs, and element screenshots stay on your machine unless you press Send
          report.
        </p>
        <p>
          Turning Twiddle on, opening Adaptive, or turning Device UA on does not send page content to us. Device UA only
          rewrites request headers and page-visible device APIs in Adaptive iframes on the site you granted, so that site’s
          own servers see a phone or tablet profile. That traffic goes to the site you are reviewing, not to Twiddle.
        </p>

        <h2>3. What we collect, and only after Send</h2>
        <p>Collection happens only when you open Leave feedback and press Send report.</p>
        <ul>
          <li>Feedback note (unless you attach a screenshot instead)</li>
          <li>Optional reply email</li>
          <li>Up to four screenshots (maximum 2 MiB each); these may show the page you were reviewing</li>
          <li>Current page URL — always attached by the current code</li>
        </ul>
        <p>
          Purpose: product support, debugging, and a reply if you left an email. We do not sell this data or use it for ads,
          creditworthiness, or unrelated profiling.
        </p>

        <h2>4. Who receives it</h2>
        <ol>
          <li>
            <a href="https://formsubmit.co">FormSubmit</a> — HTTPS relay that emails the submission. Their policy:{' '}
            <a href="https://formsubmit.co/privacy.pdf">formsubmit.co/privacy.pdf</a>.
          </li>
          <li>
            The receiving mailbox — currently Gmail, operated by Google. Policy:{' '}
            <a href="https://policies.google.com/privacy">policies.google.com/privacy</a>.
          </li>
        </ol>
        <p>
          No other third party is used for feedback in this build. FormSubmit’s response is read as status data only; Twiddle
          does not execute returned scripts.
        </p>

        <h2>5. Local copies</h2>
        <ul>
          <li>
            After Send, the extension stores a copy (last 20 reports, quota permitting) in <code>chrome.storage.local</code>.
            The inspected website cannot read it.
          </li>
          <li>
            Twiddle deletes any leftover page-origin <code>localStorage</code> key <code>twiddle-feedback-inbox</code> and
            does not write feedback there anymore.
          </li>
          <li>
            UI preferences stay in the page’s <code>localStorage</code> under <code>twiddle-prefs</code>. They are not sent
            to us. Same-origin scripts on that site can read those preferences. They do not include your feedback note,
            email, or screenshots.
          </li>
        </ul>

        <h2>6. Retention and deletion</h2>
        <p>
          Email copies are kept as long as needed to understand and reply, then deleted on request. Extension storage copies
          last for up to 20 reports or until you remove the extension. To delete a report we hold, email the contact above
          from the address you used (or describe the report).
        </p>

        <h2>7. Security</h2>
        <p>
          Feedback is sent over HTTPS to FormSubmit. We do not ask for passwords, cookies, or authentication tokens. Do not
          attach secrets, and do not send a report from a page you are not allowed to share.
        </p>

        <h2>8. Permissions</h2>
        <p>
          Chrome may ask for the current site only when you turn Device UA on in Adaptive. That grant is not used to upload
          the page to us. The toolbar icon or Alt+Shift+S injects the inspector on the active tab.
        </p>

        <h2>9. Children</h2>
        <p>Twiddle is not directed at children under 13. We do not knowingly collect their data.</p>

        <h2>10. Changes</h2>
        <p>
          If collection, processors, or purposes change, this policy and the Chrome Web Store privacy-practices form will be
          updated before that build ships.
        </p>

        <h2>11. Contact</h2>
        <p>
          Privacy and deletion: <a href="mailto:caymnjke@gmail.com">caymnjke@gmail.com</a>
        </p>
        <p>
          Product mail (after Email Routing): <code>privacy@twiddle.tools</code>, <code>hello@twiddle.tools</code>.
        </p>
      </main>
    </SiteShell>
  );
}
