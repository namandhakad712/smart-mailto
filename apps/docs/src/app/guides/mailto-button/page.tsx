import type { Metadata } from 'next';
import { CodeBlock, GeneratorCta, GuideHeader, GuideSection } from '@/components/GeneratorGuide';
import { buttonCss, buttonHtml, buttonMailto } from '@/lib/generatorGuideExamples';

const pageUrl = 'https://smart-mailto.vercel.app/guides/mailto-button';

export const metadata: Metadata = {
  title: 'How to Put a Mailto Link on a Button',
  description:
    'Use a styled anchor for a mailto button. Copy accessible HTML and CSS, add a prefilled subject and body, and avoid common button mistakes.',
  alternates: { canonical: pageUrl },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'How to put a mailto link on a button',
    description:
      'Style an anchor like a button so the control keeps its link semantics and opens an email composer.',
  },
};

const faqItems = [
  {
    question: 'Can I put a mailto link on a button?',
    answer:
      'Yes, but use an anchor element with a mailto href and style it like a button. An anchor has the correct semantics for opening a destination.',
  },
  {
    question: 'Should I use button onclick for mailto?',
    answer:
      'Usually no. A normal anchor works without custom JavaScript and preserves standard link behavior for keyboards, context menus, and assistive technology.',
  },
  {
    question: 'How do I prefill a mailto button?',
    answer:
      'Add encoded subject and body parameters to the href. Keep the visible button label short and specific.',
  },
] as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function MailtoButtonGuide() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <GuideHeader
        answer="Use an anchor with a mailto href, then style the anchor as a button. Do not nest an anchor inside a button."
        answerCode='<a class="email-button" href="mailto:hello@example.com">Email us</a>'
        eyebrow="HTML and CSS guide"
        intro="A mailto control goes to an email destination, so it should remain a link. CSS can give that link the size, contrast, and states of a button."
        title="Put a mailto link on a button"
      />

      <div className="mx-auto max-w-3xl space-y-16 py-14">
        <GuideSection label="Correct element" title="Style a link instead of changing its meaning">
          <p>
            Use <code>&lt;a href=&quot;mailto:…&quot;&gt;</code>. A link already supports keyboard
            focus, browser status text, context menus, and assistive-technology link lists. A
            <code>&lt;button&gt;</code> is for an action inside the current page.
          </p>
          <div className="border-y border-border py-8 text-center dark:border-border">
            <a
              className="inline-flex min-h-11 items-center justify-center bg-red px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-red-dark active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
              href={buttonMailto}
            >
              Ask about pricing
            </a>
            <p className="mt-4 text-sm text-ink-muted dark:text-text-muted">
              This is a real anchor with button styling.
            </p>
          </div>
        </GuideSection>

        <GuideSection label="Tested example" title="Add the URL, label, and visible states">
          <p>
            This example keeps a 44-pixel minimum target, clear contrast, a hover state, and a
            visible keyboard focus ring. The subject and body are percent-encoded inside the href.
          </p>
          <CodeBlock label="HTML">{buttonHtml}</CodeBlock>
          <CodeBlock label="CSS">{buttonCss}</CodeBlock>
        </GuideSection>

        <GuideSection label="Accessible copy" title="Name the result, not the control type">
          <p>
            Use a label such as <strong>Email support</strong>, <strong>Ask about pricing</strong>,
            or <strong>Send product feedback</strong>. Avoid labels such as{' '}
            <strong>Click here</strong> or <strong>Submit</strong>. The visitor should know that the
            control opens an email composer.
          </p>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            <div className="bg-paper p-6 dark:bg-bg">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red">
                Good labels
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Email support</li>
                <li>Ask about pricing</li>
                <li>Send feedback</li>
              </ul>
            </div>
            <div className="bg-surface p-6 dark:bg-surface-container">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red">
                Avoid
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Click here</li>
                <li>Submit</li>
                <li>Continue</li>
              </ul>
            </div>
          </div>
        </GuideSection>

        <GuideSection label="Common mistake" title="Do not hide a link behind JavaScript">
          <p>
            Avoid <code>onclick=&quot;window.location=&apos;mailto:…&apos;&quot;</code> on a button.
            It adds code without improving the handoff. It also removes the destination from the
            HTML and can make the control harder to inspect or reuse.
          </p>
          <p>
            Do not put an anchor inside a button or a button inside an anchor. Nested interactive
            controls create invalid behavior for keyboard and screen-reader users.
          </p>
        </GuideSection>

        <GuideSection label="Before publishing" title="Check the complete interaction">
          <ol className="space-y-4">
            {[
              'Tab to the link and confirm the focus ring is visible.',
              'Open it and confirm the correct recipient, subject, and body appear.',
              'Check the label at narrow widths and with larger text.',
              'Keep another contact route when email delivery must be guaranteed.',
            ].map((item, index) => (
              <li className="grid grid-cols-[36px_1fr] gap-3" key={item}>
                <span className="font-mono text-xs text-red">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </GuideSection>

        <GeneratorCta
          copy="The free smart-mailto generator builds the encoded href and ready-to-paste anchor. Add your own class and button styles after copying it."
          title="Generate the button href before you style it"
        />
      </div>
    </article>
  );
}
