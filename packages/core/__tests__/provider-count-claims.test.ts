import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllProviders } from '../src/providers.js';

const repositoryRoot = resolve(process.cwd(), '../..');
const repositoryFile = (path: string) => readFileSync(resolve(repositoryRoot, path), 'utf8');

describe('maintained provider count claims', () => {
  const webmailProviders = getAllProviders().filter(
    provider => !provider.isNative && !provider.isCopy,
  );
  const counts = {
    webmail: webmailProviders.length,
    compose: webmailProviders.filter(provider => !provider.fallbackOnly).length,
    fallback: webmailProviders.filter(provider => provider.fallbackOnly).length,
  };

  it('partitions every webmail entry by registry disposition', () => {
    expect(counts.compose + counts.fallback).toBe(counts.webmail);
  });

  it('keeps static README, package, changeset, badge, and demo claims in parity', () => {
    const rootReadme = repositoryFile('README.md');
    const corePackage = JSON.parse(repositoryFile('packages/core/package.json')) as {
      description: string;
    };
    const coreReadme = repositoryFile('packages/core/README.md');
    const changelog = repositoryFile('CHANGELOG.md');
    const demoHtml = repositoryFile('apps/demo/index.html');

    expect(rootReadme).toContain(`Webmail_Entries-${counts.webmail}`);
    expect(rootReadme).toContain(
      `**${counts.webmail}** entries      | ✅ **${counts.compose}** compose links + **${counts.fallback}** fallback pages`,
    );
    expect(corePackage.description).toContain(`${counts.webmail}-entry webmail registry`);
    expect(coreReadme).toContain(
      `${counts.webmail} webmail entries: ${counts.compose} compose links and ${counts.fallback} fallback pages`,
    );
    expect(coreReadme).toContain(`${counts.webmail} webmail entries plus native and copy actions`);
    expect(changelog).toContain(`registry to ${counts.webmail} webmail entries`);
    expect(changelog).toContain(
      `${counts.webmail} webmail entries plus native-mail and copy-address actions`,
    );

    for (const [kind, count] of Object.entries(counts)) {
      const claims = [
        ...demoHtml.matchAll(new RegExp(`data-provider-count="${kind}"[^>]*>(\\d+)<`, 'g')),
      ];

      expect(claims.length, `demo should retain a ${kind} fallback claim`).toBeGreaterThan(0);
      expect(claims.map(claim => Number(claim[1]))).toEqual(Array(claims.length).fill(count));
    }
  });

  it('renders live documentation totals from the shipped registry', () => {
    const providerTable = repositoryFile('apps/docs/src/components/ProviderTable.tsx');
    const providerPage = repositoryFile('apps/docs/src/app/providers/page.tsx');
    const specPage = repositoryFile('apps/docs/src/app/spec/page.tsx');

    expect(providerTable).toContain('{providers.length} webmail entries:');
    expect(providerPage).toContain('{WEBMAIL_PROVIDERS.length} webmail entries:');
    expect(specPage).toContain('{webmailProviders.length} webmail entries:');
  });
});
