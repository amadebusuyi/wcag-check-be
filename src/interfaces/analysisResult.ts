/**
 * Interface describing an individual accessibility issue.
 */
export interface AnalysisIssue {
  issue: string;
  severity: string;
  weight: number;
  description: string;
  suggestion: string;
  element?: string;
}

/**
 * Interface for the overall analysis result.
 */
export interface AnalysisResult {
  complianceScore: number;
  issues: AnalysisIssue[];
}
