/* eslint-disable import/no-extraneous-dependencies */
import { AxePuppeteer } from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';
import { AnalysisResult, AnalysisIssue } from '../interfaces/analysisResult';
// import { checkImageAlt, checkHeadingHierarchy, checkDocumentLanguage, checkEmptyLinks, checkFormInputLabels, checkStyleContrastIssues, checkMissingTitleTag, checkNonDescriptiveLinks } from '../utils/htmlParser';
import generativeAI from '../utils/generativeAI';

/**
 * Analyzes the provided HTML string for common accessibility issues.
 * @param html The HTML content as a string.
 * @returns The analysis result including a compliance score and a list of issues.
 */
export const analyzeHTML = async (html: string): Promise<AnalysisResult> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'load' });

  const results = await new AxePuppeteer(page).analyze();
  await browser.close();
  
  let issues: AnalysisIssue[] = [];
  if (results.violations.length > 0) {
    // Get AI generated recommendations
    const responseFromAI = await generativeAI.geminiQuery(`Given the following accessibilty issues: ${JSON.stringify(results.violations)}. Update the issue suggestions with more helpful information where necessary annd return the updated issues array only uing this format: [{
      issue: 'Missing alt attribute on <img> tag',
      severity: 'critical',
      weight: 10,
      description: 'An image is missing an alt attribute, which is necessary for accessibility.',
      suggestion: 'Add a meaningful alt attribute to the image tag.',
      element: element,
    }];. Report severity level with either critical, high, medium or low and also add the weight on a scale of 20`);
    if (responseFromAI.indexOf('```json') > -1) {
      const script = responseFromAI.replace('```json', '').split('```')[0];
      issues = JSON.parse(script);
    } else throw new Error('Unable to process request right now');
  }

  // Calculate compliance score.
  const maxScore = 100;
  let issueScore = 0;
  issues.forEach((issue) => {
    if (issue.severity.toLowerCase() === 'critical') issueScore += issue.weight;
    else if (issue.severity.toLowerCase() === 'high') issueScore += issue.weight;
    else if (issue.severity.toLowerCase() === 'medium') issueScore += issue.weight;
    else issueScore += issue.weight;
  });

  return { issues, complianceScore: (maxScore - issueScore) > 0 ? maxScore - issueScore : 0 };
};