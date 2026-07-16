import type { Reporter } from './types';
import { markdownReporter } from './markdown';
import { jsonReporter } from './json';
import type { ReportResult } from '../types';

export const reporters: Reporter[] = [markdownReporter, jsonReporter];

export function renderScenarioFile(result: ReportResult): string {
  return JSON.stringify(result, null, 2);
}
