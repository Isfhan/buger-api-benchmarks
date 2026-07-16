import type { Reporter } from './types';
import type { ReportMeta, ReportResult } from '../types';

export const jsonReporter: Reporter = {
  extension: 'json',
  render(meta: ReportMeta, results: ReportResult[]): string {
    return JSON.stringify({ meta, results }, null, 2);
  },
};
