const SITE_URL = 'https://smart-mailto.vercel.app';

export const brokenMailtoHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to fix a mailto link that is not working',
  description:
    'Check the link and page scripts, browser protocol handler, default mail app, and visitor fallback.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Test a minimal mailto link and page scripts',
      text: 'Test one known-good mailto address, then confirm that page JavaScript does not cancel the click without opening a destination.',
      url: `${SITE_URL}/guides/mailto-link-opens-nothing#check-the-link`,
    },
    {
      '@type': 'HowToStep',
      name: 'Check the browser protocol handler',
      text: 'Try a private window and review the browser protocol-handler settings for mailto links.',
      url: `${SITE_URL}/guides/mailto-link-opens-nothing#check-the-browser`,
    },
    {
      '@type': 'HowToStep',
      name: 'Confirm the default mail app',
      text: 'Confirm that the operating system has a mail application set as the default handler for email links.',
      url: `${SITE_URL}/guides/mailto-link-opens-nothing#check-the-system`,
    },
    {
      '@type': 'HowToStep',
      name: 'Add a visitor-controlled fallback',
      text: 'Show the address, offer a webmail picker, or use a contact form when receipt must be recorded.',
      url: `${SITE_URL}/guides/mailto-link-opens-nothing#choose-a-fallback`,
    },
  ],
};

export const chromeHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to fix a mailto link that is not working in Chrome',
  description:
    'Check Chrome protocol handlers, Gmail registration, the system email default, the mailto link, and a visitor-controlled fallback.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Allow Chrome to open email handlers',
      text: 'Open Chrome handler settings, allow sites to ask to handle protocols, remove any unwanted saved handler, and retry the link in a normal tab.',
      url: `${SITE_URL}/guides/mailto-not-working-in-chrome#quick-fix`,
    },
    {
      '@type': 'HowToStep',
      name: "Register Gmail as Chrome's email handler",
      text: 'Open Gmail in the same Chrome profile and accept Gmail as the email handler if Chrome offers the handler icon.',
      url: `${SITE_URL}/guides/mailto-not-working-in-chrome#gmail`,
    },
    {
      '@type': 'HowToStep',
      name: 'Choose a default email app in the operating system',
      text: 'Set the preferred email application as the device default for mailto links, then retry the link in Chrome.',
      url: `${SITE_URL}/guides/mailto-not-working-in-chrome#system-default`,
    },
    {
      '@type': 'HowToStep',
      name: 'Prove the link works before blaming Chrome',
      text: 'Test a plain mailto anchor, remove click interception, test outside embedded previews, and percent-encode the subject and body.',
      url: `${SITE_URL}/guides/mailto-not-working-in-chrome#site-owner`,
    },
    {
      '@type': 'HowToStep',
      name: 'Offer webmail without deleting the mailto fallback',
      text: 'Keep the original mailto link and offer webmail, native mail, and copy-address choices so visitors are not limited to one configured handler.',
      url: `${SITE_URL}/guides/mailto-not-working-in-chrome#durable-fix`,
    },
  ],
};

export const replaceMailtoHowToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to replace a mailto link with a webmail picker',
  description:
    'Install smart-mailto, initialize it once, and keep a normal mailto link as the fallback.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Install the core package',
      text: 'Install @smart-mailto/core with npm.',
      url: `${SITE_URL}/guides/replace-mailto#install`,
    },
    {
      '@type': 'HowToStep',
      name: 'Initialize smart-mailto once',
      text: 'Import initSmartMailto in the browser entry file and call it once.',
      url: `${SITE_URL}/guides/replace-mailto#initialize`,
    },
    {
      '@type': 'HowToStep',
      name: 'Add or keep a normal mailto link',
      text: 'Keep existing mailto anchors or add a normal mailto link for smart-mailto to intercept.',
      url: `${SITE_URL}/guides/replace-mailto#add-the-link`,
    },
  ],
};
