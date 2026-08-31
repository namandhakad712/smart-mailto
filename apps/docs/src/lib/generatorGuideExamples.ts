import { buildMailtoHtml, buildMailtoLink } from './mailtoGenerator';

export const subjectBodyFields = {
  to: 'hello@example.com',
  subject: 'Budget & timing?',
  body: 'Hi team,\n\nCan we talk at 2:30?',
} as const;

export const subjectBodyMailto = buildMailtoLink(subjectBodyFields);
export const subjectBodyHtml = buildMailtoHtml(subjectBodyMailto, 'Email the team');

export const buttonFields = {
  to: 'sales@example.com',
  subject: 'Pricing question',
  body: 'Hi,\n\nI would like to ask about pricing.',
} as const;

export const buttonMailto = buildMailtoLink(buttonFields);

export const buttonHtml = `<a class="email-button" href="${buttonMailto.replaceAll('&', '&amp;')}">\n  Ask about pricing\n</a>`;

export const buttonCss = `.email-button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  padding: 12px 20px;
  background: #a12f24;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

.email-button:hover { background: #7d251b; }
.email-button:focus-visible {
  outline: 2px solid #a12f24;
  outline-offset: 3px;
}`;

export const emailTemplates = [
  {
    name: 'Support request',
    use: 'Collect the product area and a short problem report.',
    fields: {
      to: 'support@example.com',
      subject: 'Support request: [topic]',
      body: 'Hi support,\n\nI need help with: [problem]\n\nWhat I expected: [result]',
    },
  },
  {
    name: 'Sales enquiry',
    use: 'Prompt for the plan, team size, and timing.',
    fields: {
      to: 'sales@example.com',
      subject: 'Sales enquiry',
      body: 'Hi sales,\n\nTeam size: [number]\nUse case: [details]\nTimeline: [date]',
    },
  },
  {
    name: 'Product feedback',
    use: 'Ask for one clear observation and its impact.',
    fields: {
      to: 'feedback@example.com',
      subject: 'Product feedback',
      body: 'Hi team,\n\nI noticed: [observation]\n\nThis affected: [outcome]',
    },
  },
] as const;

export const emailTemplateMailtos = emailTemplates.map(template => ({
  ...template,
  mailto: buildMailtoLink(template.fields),
}));
