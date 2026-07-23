/**
 * Provider URL Validator
 *
 * Checks every webmail provider in the canonical registry and writes a report
 * for the weekly GitHub Actions workflow.
 *
 * Run: pnpm validate:providers
 */

import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildProviderTargets,
  runValidation,
  summarizeResults,
  type ValidationResult,
} from './validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function formatResult(id: string, result: ValidationResult): string {
  const status = result.status ?? 'N/A';
  return `  ${id.padEnd(22)} ${result.classification.padEnd(14)} ${status}`;
}

export async function main(): Promise<void> {
  const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  const targets = buildProviderTargets();

  console.log(`\nValidating ${targets.length} webmail providers from the canonical registry...\n`);

  const report = await runValidation(
    targets,
    verbose
      ? {
          onResult: (id, result) => {
            console.log(formatResult(id, result));
          },
        }
      : {},
  );
  const summary = summarizeResults(report);

  console.log(
    [
      `Healthy: ${summary.healthy}`,
      `Login required: ${summary['login-required']}`,
      `Bot protected: ${summary['bot-protected']}`,
      `Fallback only: ${summary['fallback-only']}`,
      `Unreachable: ${summary.unreachable}`,
    ].join(' | '),
  );

  const reportPath = path.join(__dirname, 'report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report written to ${reportPath}\n`);

  if (summary.unreachable > 0) {
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('Validator crashed:', error);
    process.exitCode = 1;
  });
}
