import { AnalysisResult, AnalysisIssue } from '../interfaces/analysisResult';
import { parseHTML, checkImageAlt, checkHeadingHierarchy, checkDocumentLanguage, checkEmptyLinks, checkFormInputLabels, checkStyleContrastIssues, checkMissingTitleTag, checkNonDescriptiveLinks } from '../utils/htmlParser';
import generativeAI from '../utils/generativeAI';

/**
 * Analyzes the provided HTML string for common accessibility issues.
 * @param html The HTML content as a string.
 * @returns The analysis result including a compliance score and a list of issues.
 */
export const analyzeHTML = async (html: string, isTest: boolean = false): Promise<AnalysisResult> => {
  const parsedHtml = parseHTML(html);

  let issues: AnalysisIssue[] = [];

  // Check for issues
  [checkImageAlt, checkHeadingHierarchy, checkDocumentLanguage, checkEmptyLinks, checkFormInputLabels, checkStyleContrastIssues, checkMissingTitleTag, checkNonDescriptiveLinks].forEach((fn) => {
    const accessibilityIssues = fn(parsedHtml);
    issues.push(...accessibilityIssues);
  });

  // Calculate compliance score.
  const maxScore = 100;
  const penaltyPerIssue = 10;
  let score = maxScore - issues.length * penaltyPerIssue;
  if (score < 0) score = 0;
  if (issues.length > 0 && !isTest) {
    try {
      // Get AI generated recommendations
      const responseFromAI = await generativeAI.geminiQuery(`Given the following accessibilty issues: ${JSON.stringify(issues)}. Update the issue suggestions with more helpful information where necessary annd return the updated issues array only.`);
      if (responseFromAI.indexOf('```json') > -1) {
        const script = responseFromAI.replace('```json', '').split('```')[0];
        issues = JSON.parse(script);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return {
    complianceScore: score,
    issues,
  };
};
