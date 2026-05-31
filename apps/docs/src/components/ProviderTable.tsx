import React from 'react';
import { getAllProviders } from '@smart-mailto/core';

export function ProviderTable() {
  const providers = getAllProviders().filter(p => !p.isCopy && p.id !== 'native');

  return (
    <div className="w-full max-w-5xl mx-auto mt-32 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Supported Providers</h2>
        <p className="text-zinc-400">
          Over 80 webmail providers supported globally. Out of the box.
        </p>
      </div>

      <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl">
        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-300">Provider Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-300">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {providers.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: p.color || '#fff' }}
                        />
                        <span className="text-zinc-200 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                        {p.id}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
