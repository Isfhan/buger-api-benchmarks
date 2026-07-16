import type { ReportMeta, ReportResult } from '../types';

export interface Reporter {
  extension: string;
  render(meta: ReportMeta, results: ReportResult[]): string;
}
