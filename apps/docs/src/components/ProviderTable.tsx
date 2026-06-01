import React from 'react';
import { getAllProviders } from '@smart-mailto/core';

export function ProviderTable() {
  const providers = getAllProviders().filter(p => !p.isCopy && p.id !== 'native');

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="font-headline text-2xl font-normal tracking-[-0.01em] text-ink dark:text-text">
          All supported providers
        </h3>
        <p className="font-body text-sm italic text-ink-soft dark:text-text-soft mt-1">
          Over 80 webmail providers. Out of the box.
        </p>
      </div>

      <div className="bg-surface dark:bg-surface-container border border-border dark:border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead>
              <tr className="border-b border-border dark:border-border font-mono text-[0.5625rem] text-ink-muted dark:text-text-muted uppercase tracking-[0.06em]">
                <th className="px-4 py-3 font-medium">Provider name</th>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Regions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border">
              {providers.map(p => (
                <tr
                  key={p.id}
                  className="hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: p.color || '#888' }}
                      />
                      <span className="text-ink dark:text-text font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <code className="font-mono text-[0.6875rem] text-red bg-red/10 px-1.5 py-0.5 border border-border dark:border-border">
                      {p.id}
                    </code>
                  </td>
                  <td className="px-4 py-2.5 hidden sm:table-cell font-mono text-[0.625rem] text-ink-muted dark:text-text-muted">
                    {p.regions?.join(', ') || 'global'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-mono text-[0.5rem] text-ink-muted dark:text-text-muted text-center mt-3 tracking-[0.06em] uppercase">
        Geo-detection via Intl APIs · zero network requests · &lt;1ms
      </p>
    </div>
  );
}
