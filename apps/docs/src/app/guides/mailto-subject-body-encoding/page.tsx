import type { Metadata } from 'next';
import { CodeBlock, GeneratorCta, GuideHeader, GuideSection } from '@/components/GeneratorGuide';
import { subjectBodyHtml, subjectBodyMailto } from '@/lib/generatorGuideExamples';

const pageUrl = 'https://smart-mailto.vercel.app/guides/mailto-subject-body-encoding';

export const metadata: Metadata = {
  title: 'Mailto Subject and Body Encoding: Spaces, Symbols and Line Breaks',
  description:
    'Encode a mailto subject and body correctly. See working examples for spaces, ampersands, question marks, punctuation, and line breaks.',
  alternates: { canonical: pageUrl },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Mailto subject and body encoding',
    description:
      'Use percent-encoding for mailto subject and body values, then escape ampersands in HTML source.',
  },
};

const faqItems = [
  {
    question: 'How do I add a subject and body to a mailto link?',
    answer:
      'Put a question mark before subject, then add body with an ampersand. Percent-encode both values.',
  },
  {
    question: 'How do I add a line break to a mailto body?',
    answer:
      'Encode a line-feed character as %0A. A blank line becomes %0A%0A. Test the result in the clients you support.',
  },
  {
    question: 'Why is an ampersand escaped in HTML?',
    answer:
      'The ampersand separates mailto fields. HTML source uses an ampersand entity for that separator, while the final URL still uses one ampersand.',
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

const encodingRows = [
  ['Space', ' ', '%20'],
  ['Ampersand', '&', '%26'],
  ['Question mark', '?', '%3F'],
  ['Colon', ':', '%3A'],
  ['Comma', ',', '%2C'],
  ['Line break', 'new line', '%0A'],
] as const;

export default function MailtoSubjectBodyEncodingGuide() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <GuideHeader
        answer="Put a question mark before the first field. Separate later fields with an ampersand. Percent-encode the subject and body values."
        answerCode="mailto:hello@example.com?subject=Hello%20there&amp;body=First%20line%0ASecond%20line"
        eyebrow="HTML guide · RFC 6068"
        intro="A valid mailto link keeps its separators readable and encodes the message content. Spaces, punctuation, and line breaks each need the correct percent code."
        title="Encode a mailto subject and body correctly"
      />

      <div className="mx-auto max-w-3xl space-y-16 py-14">
        <GuideSection label="The structure" title="Separate the fields before you encode them">
          <p>
            Start with <code>mailto:</code> and the recipient. Add <code>?subject=</code> before the
            subject. Add <code>&amp;body=</code> before the body. The question mark and ampersand
            are structural separators, so do not encode them.
          </p>
          <figure className="border-y border-border py-6 dark:border-border">
            <div className="flex flex-wrap gap-2 font-mono text-xs leading-6">
              <span className="bg-code-bg px-3 py-2 text-white">mailto:hello@example.com</span>
              <span className="bg-red px-3 py-2 text-white">?subject=</span>
              <span className="bg-surface px-3 py-2 text-ink dark:bg-surface-container dark:text-text">
                encoded value
              </span>
              <span className="bg-red px-3 py-2 text-white">&amp;body=</span>
              <span className="bg-surface px-3 py-2 text-ink dark:bg-surface-container dark:text-text">
                encoded value
              </span>
            </div>
            <figcaption className="mt-4 text-sm leading-6 text-ink-muted dark:text-text-muted">
              The red segments are separators. Only the subject and body values are encoded.
            </figcaption>
          </figure>
        </GuideSection>

        <GuideSection label="Encoding table" title="Use percent codes for reserved characters">
          <p>
            Encode the text as UTF-8, then replace reserved bytes with percent codes. Do not replace
            spaces with literal spaces. <code>%20</code> is clearer than <code>+</code> across mail
            clients.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-ink text-ink dark:border-text dark:text-text">
                  <th className="w-1/2 py-3 pr-3 font-mono text-[10px] uppercase tracking-wider">
                    Character
                  </th>
                  <th className="w-1/4 py-3 pr-3 font-mono text-[10px] uppercase tracking-wider">
                    Plain
                  </th>
                  <th className="w-1/4 py-3 font-mono text-[10px] uppercase tracking-wider">
                    Encoded
                  </th>
                </tr>
              </thead>
              <tbody>
                {encodingRows.map(([name, plain, encoded]) => (
                  <tr className="border-b border-border" key={name}>
                    <th className="py-4 pr-3 font-medium text-ink dark:text-text">{name}</th>
                    <td className="py-4 pr-3 font-mono text-xs">{plain}</td>
                    <td className="py-4 font-mono text-xs text-red">{encoded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GuideSection>

        <GuideSection label="Tested example" title="Encode the text, not the meaning">
          <p>
            This example preserves an ampersand, a question mark, a colon, a comma, and two line
            breaks. The decoded draft reads exactly like the original message.
          </p>
          <CodeBlock label="Mailto URL">{subjectBodyMailto}</CodeBlock>
          <CodeBlock label="Ready-to-paste HTML">{subjectBodyHtml}</CodeBlock>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            <div className="bg-paper p-5 dark:bg-bg">
              <h3 className="font-semibold text-ink dark:text-text">Subject</h3>
              <p className="mt-2 text-sm">Budget &amp; timing?</p>
            </div>
            <div className="bg-surface p-5 dark:bg-surface-container">
              <h3 className="font-semibold text-ink dark:text-text">Body</h3>
              <p className="mt-2 whitespace-pre-line text-sm">
                {'Hi team,\n\nCan we talk at 2:30?'}
              </p>
            </div>
          </div>
        </GuideSection>

        <GuideSection label="HTML source" title="Escape the separator one more time in markup">
          <p>
            A raw mailto URL uses <code>&amp;</code> between query fields. Inside an HTML attribute,
            write that separator as <code>&amp;amp;</code>. The browser turns it back into one
            ampersand before opening the mail client.
          </p>
          <p>
            Do not encode the whole URL with <code>encodeURIComponent()</code>. That would also
            encode <code>mailto:</code>, the question mark, and the field separators. Encode each
            subject or body value separately, then assemble the URL.
          </p>
        </GuideSection>

        <GuideSection label="Client check" title="Test the final draft, not only the string">
          <p>
            Open the link in the browser and email clients that matter to your audience. Confirm the
            recipient, subject, punctuation, and blank lines. A syntactically valid link can still
            behave differently when a client applies its own parsing rules.
          </p>
        </GuideSection>

        <GeneratorCta
          copy="The free smart-mailto generator encodes each field and returns both the URL and escaped HTML. It runs in your browser."
          title="Build the encoded link without hand-editing percent codes"
        />
      </div>
    </article>
  );
}
