import { describe, expect, it } from 'vitest';
import {
  brokenMailtoHowToSchema,
  chromeHowToSchema,
  replaceMailtoHowToSchema,
} from '../lib/guideStructuredData';

const SITE_URL = 'https://smart-mailto.vercel.app';

describe('instructional guide structured data', () => {
  it.each([
    {
      schema: brokenMailtoHowToSchema,
      pageUrl: `${SITE_URL}/guides/mailto-link-opens-nothing`,
      stepNames: [
        'Test a minimal mailto link and page scripts',
        'Check the browser protocol handler',
        'Confirm the default mail app',
        'Add a visitor-controlled fallback',
      ],
      anchors: ['check-the-link', 'check-the-browser', 'check-the-system', 'choose-a-fallback'],
    },
    {
      schema: chromeHowToSchema,
      pageUrl: `${SITE_URL}/guides/mailto-not-working-in-chrome`,
      stepNames: [
        'Allow Chrome to open email handlers',
        "Register Gmail as Chrome's email handler",
        'Choose a default email app in the operating system',
        'Prove the link works before blaming Chrome',
        'Offer webmail without deleting the mailto fallback',
      ],
      anchors: ['quick-fix', 'gmail', 'system-default', 'site-owner', 'durable-fix'],
    },
    {
      schema: replaceMailtoHowToSchema,
      pageUrl: `${SITE_URL}/guides/replace-mailto`,
      stepNames: [
        'Install the core package',
        'Initialize smart-mailto once',
        'Add or keep a normal mailto link',
      ],
      anchors: ['install', 'initialize', 'add-the-link'],
    },
  ])(
    'keeps $pageUrl aligned with its visible sequence',
    ({ schema, pageUrl, stepNames, anchors }) => {
      expect(schema).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
      });
      expect(schema.name).toBeTruthy();
      expect(schema.description).toBeTruthy();
      expect(schema.step.map(step => step.name)).toEqual(stepNames);
      expect(schema.step.map(step => step.url)).toEqual(
        anchors.map(anchor => `${pageUrl}#${anchor}`),
      );
      expect(schema.step.every(step => step['@type'] === 'HowToStep' && step.text.length > 0)).toBe(
        true,
      );
    },
  );
});
