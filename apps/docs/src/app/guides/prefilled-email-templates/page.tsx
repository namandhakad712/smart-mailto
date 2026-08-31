import type { Metadata } from 'next';
import { CodeBlock, GeneratorCta, GuideHeader, GuideSection } from '@/components/GeneratorGuide';
import { emailTemplateMailtos } from '@/lib/generatorGuideExamples';

const pageUrl = 'https://smart-mailto.vercel.app/guides/prefilled-email-templates';

export const metadata: Metadata = {
  title: 'Prefilled Email Templates for Mailto Links',
  description:
    'Copy practical mailto templates for support, sales, and product feedback. Prefill a subject and editable body without sending or storing a message.',
  alternates: { canonical: pageUrl },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Prefilled email templates for mailto links',
    description:
      'Use short, editable prompts for support, sales, and product feedback mailto links.',
  },
};

const faqItems = [
  {
    question: 'Can a mailto link prefill an email template?',
    answer:
      'Yes. Put the template title in the subject field and the editable prompts in the body field. The visitor can change both before sending.',
  },
  {
    question: 'Can a mailto template include line breaks?',
    answer: 'Yes. Encode each line break as %0A. A blank line becomes %0A%0A.',
  },
  {
    question: 'Does a prefilled mailto link send the email?',
    answer:
      'No. It opens an email composer. The visitor reviews and sends the message from their own email account.',
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

export default function PrefilledEmailTemplatesGuide() {
  return (
    <article className="mx-auto max-w-6xl">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <GuideHeader
        answer="Put a short template title in the subject. Put editable prompts in the body. Encode spaces, punctuation, and line breaks."
        answerCode="mailto:support@example.com?subject=Support%20request&amp;body=Hi%20support%2C%0A%0AI%20need%20help%20with%3A%20%5Bproblem%5D"
        eyebrow="Copy-ready examples"
        intro="A good prefilled email template reduces the blank-page problem. It asks for only the details needed to start a useful reply."
        title="Prefilled email templates for common contact cases"
      />

      <div className="mx-auto max-w-3xl space-y-16 py-14">
        <GuideSection label="Template rule" title="Prompt the visitor without writing their answer">
          <p>
            Keep the subject specific and the body short. Use square-bracket prompts for details the
            visitor should replace. Leave room for context instead of forcing a long questionnaire
            into the email composer.
          </p>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            {['Clear subject', 'Three prompts or fewer', 'Editable before sending'].map(
              (item, index) => (
                <div className="bg-paper p-5 dark:bg-bg" key={item}>
                  <span className="font-mono text-xs text-red">0{index + 1}</span>
                  <p className="mt-3 text-sm font-semibold text-ink dark:text-text">{item}</p>
                </div>
              ),
            )}
          </div>
        </GuideSection>

        <GuideSection label="Three patterns" title="Start with a template that matches the job">
          <div className="space-y-10">
            {emailTemplateMailtos.map((template, index) => (
              <article
                className="border-t border-border pt-6 dark:border-border"
                key={template.name}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-red">0{index + 1}</span>
                  <div>
                    <h3 className="font-headline text-2xl font-medium text-ink dark:text-text">
                      {template.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6">{template.use}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <CodeBlock label={`${template.name} mailto URL`}>{template.mailto}</CodeBlock>
                </div>
              </article>
            ))}
          </div>
        </GuideSection>

        <GuideSection label="Message design" title="Ask for facts that change the next reply">
          <p>
            A support template can ask what happened and what the visitor expected. A sales template
            can ask for team size, use case, and timing. A feedback template can ask for one
            observation and its effect.
          </p>
          <p>
            Avoid prompts that do not change the next step. Long templates create more work and are
            easy to abandon. If you need required fields, validation, uploads, or dependable
            routing, use a form instead.
          </p>
        </GuideSection>

        <GuideSection label="Privacy" title="Do not place private data in the link">
          <p>
            Mailto URLs can appear in page source, browser history, copied text, and analytics tools
            outside your control. Use placeholders, not account numbers, access tokens, private
            customer details, or a hidden distribution list.
          </p>
          <p>
            The template should ask the visitor to add sensitive context only after their email
            composer opens. Even then, tell them what information your team actually needs.
          </p>
        </GuideSection>

        <GuideSection label="Before publishing" title="Test every field in a real composer">
          <ol className="space-y-4">
            {[
              'Confirm the recipient and subject are correct.',
              'Check that blank lines appear where you expect them.',
              'Replace each bracketed prompt as a visitor would.',
              'Open the link in the email clients your audience uses.',
            ].map((item, index) => (
              <li className="grid grid-cols-[36px_1fr] gap-3" key={item}>
                <span className="font-mono text-xs text-red">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </GuideSection>

        <GeneratorCta
          copy="The free smart-mailto generator encodes your subject and multiline body. It returns a mailto URL and escaped HTML without saving the message."
          title="Turn one of these templates into ready-to-paste HTML"
        />
      </div>
    </article>
  );
}
