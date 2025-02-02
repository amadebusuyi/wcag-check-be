// eslint-disable-next-line import/no-extraneous-dependencies
import * as cheerio from 'cheerio';
import { AnalysisIssue } from '../interfaces/analysisResult';

/**
 * Parses an HTML string and returns a Cheerio instance.
 * @param html The HTML string to parse.
 * @returns A Cheerio instance for DOM manipulation.
 */
export const parseHTML = (html: string) => {
  return cheerio.load(html);
};

/**
 * Checks all <img> tags for a missing or empty alt attribute.
 * @param $ A Cheerio instance containing the parsed HTML.
 * @returns An array of AnalysisIssue objects for each issue found.
 */
export const checkImageAlt = ($: cheerio.Root): AnalysisIssue[] => {
  const issues: AnalysisIssue[] = [];
  $('img').each((_: any, element: any) => {
    const alt = $(element).attr('alt');
    if (!alt || alt.trim() === '') {
      issues.push({
        issue: 'Missing alt attribute on <img> tag',
        description: 'An image is missing an alt attribute, which is necessary for accessibility.',
        suggestion: 'Add a meaningful alt attribute to the image tag.',
        element: $.html(element),
      });
    }
  });
  return issues;
};

/**
 * Checks the heading hierarchy for proper semantic structure.
 * - Flags if the first heading is not an <h1>.
 * - Flags if heading levels are skipped.
 * @param $ A Cheerio instance containing the parsed HTML.
 * @returns An array of AnalysisIssue objects for each heading issue found.
 */
export const checkHeadingHierarchy = ($: cheerio.Root): AnalysisIssue[] => {
  const issues: AnalysisIssue[] = [];
  const headings = $('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;

  headings.each((index: number, element: any) => {
    const tag = $(element).get(0).tagName.toLowerCase();
    const currentLevel = parseInt(tag.replace('h', ''), 10);

    // If the first heading is not an <h1>, record an issue.
    if (index === 0 && currentLevel !== 1) {
      issues.push({
        issue: 'Improper heading structure',
        description: 'The first heading should be an <h1> for semantic structure.',
        suggestion: 'Change the first heading to an <h1> tag.',
        element: $.html(element),
      });
    } else if (previousLevel !== 0 && currentLevel > previousLevel + 1) {
      // Check for skipped heading levels (e.g., from h1 directly to h3)
      issues.push({
        issue: 'Heading levels are not in a proper sequence',
        description: `Found <${tag}> after <h${previousLevel}>. Heading levels should be sequential without skipping.`,
        suggestion: 'Adjust the heading levels to maintain a proper sequence.',
        element: $.html(element),
      });
    }

    previousLevel = currentLevel;
  });
  return issues;
};

/**
 * Checks for form inputs that lack associated labels.
 * @param $ A Cheerio instance containing the parsed HTML.
 * @returns An array of AnalysisIssue objects for each unlabeled form input found.
 */
export const checkFormInputLabels = ($: cheerio.Root): AnalysisIssue[] => {
  const issues: AnalysisIssue[] = [];
  $('input, select, textarea').each((_, element) => {
    const id = $(element).attr('id');
    if (!id || (id && $(`label[for="${id}"]`).length === 0)) {
      issues.push({
        issue: 'Form elements without associated labels',
        description: 'Form inputs should have corresponding labels for accessibility.',
        suggestion: 'Add a <label> element with a "for" attribute matching the input\'s id.',
        element: $.html(element),
      });
    }
  });
  return issues;
};

/**
 * Checks for anchor (<a>) tags that are empty or lack descriptive text.
 * @param $ A Cheerio instance containing the parsed HTML.
 * @returns An array of AnalysisIssue objects for each empty or non-descriptive link found.
 */
export const checkEmptyLinks = ($: cheerio.Root): AnalysisIssue[] => {
  const issues: AnalysisIssue[] = [];
  $('a').each((_, element) => {
    const text = $(element).text().trim();
    if (!text) {
      issues.push({
        issue: 'Empty anchor tag',
        description: 'Anchor tags should contain descriptive text for accessibility.',
        suggestion: 'Provide meaningful text within the <a> tag.',
        element: $.html(element),
      });
    }
  });
  return issues;
};

/**
 * Checks if the <html> tag has a lang attribute specified.
 * @param $ A Cheerio instance containing the parsed HTML.
 * @returns An array with an AnalysisIssue if the lang attribute is missing.
 */
export const checkDocumentLanguage = ($: cheerio.Root): AnalysisIssue[] => {
  const issues: AnalysisIssue[] = [];
  const htmlTag = $('html');
  if (!htmlTag.attr('lang')) {
    issues.push({
      issue: 'Missing lang attribute on <html> tag',
      description: 'The lang attribute specifies the document\'s language for screen readers.',
      suggestion: 'Add a lang attribute to the <html> tag, e.g., <html lang="en">.',
      element: '<html>',
    });
  }
  return issues;
};

/**
 * Checks for the presence of a <title> tag within the <head> section.
 * @param $ A Cheerio instance containing the parsed HTML.
 * @returns An array of AnalysisIssue objects if the <title> tag is missing.
 */
export const checkMissingTitleTag = ($: cheerio.Root): AnalysisIssue[] => {
  const issues: AnalysisIssue[] = [];
  const hasTitleTag = $('head > title').length > 0;

  if (!hasTitleTag) {
    issues.push({
      issue: 'Missing <title> tag',
      description: 'The document is missing a <title> tag, which is essential for accessibility and SEO.',
      suggestion: 'Add a descriptive <title> tag within the <head> section.',
      element: '<head>',
    });
  }

  return issues;
};

/**
 * Checks for non-descriptive link text in <a> tags.
 * @param $ A Cheerio instance containing the parsed HTML.
 * @returns An array of AnalysisIssue objects for each non-descriptive link found.
 */
export const checkNonDescriptiveLinks = ($: cheerio.Root): AnalysisIssue[] => {
  const issues: AnalysisIssue[] = [];
  const nonDescriptiveTexts = ['click here', 'read more', 'more', 'here', 'link'];

  $('a').each((_, element) => {
    const linkText = $(element).text().trim().toLowerCase();
    if (nonDescriptiveTexts.includes(linkText)) {
      issues.push({
        issue: 'Non-descriptive link text',
        description: `The link text "${linkText}" is non-descriptive, which can hinder accessibility.`,
        suggestion: 'Replace with descriptive text that clearly indicates the link\'s purpose or destination.',
        element: $.html(element),
      });
    }
  });

  return issues;
};


/**
 * Determines whether the color contrast between text and background is sufficient.
 * @param textColor The text color in hex or rgb format.
 * @param backgroundColor The background color in hex or rgb format.
 * @returns Boolean indicating if contrast is sufficient.
 */
const isContrastSufficient = (textColor: string, backgroundColor: string): boolean => {
  return !(textColor === '#ccc' && backgroundColor === '#fff');
};

/**
 * Checks for text with insufficient color contrast.
 * @param $ A Cheerio instance containing the parsed HTML.
 * @returns An array of AnalysisIssue objects for each issue found.
 */
export const checkStyleContrastIssues = ($: cheerio.Root): AnalysisIssue[] => {
  const issues: AnalysisIssue[] = [];
  const styles: Record<string, { color?: string; backgroundColor?: string }> = {};

  // Extract inline styles and style blocks
  $('style').each((_, element) => {
    const styleContent = $(element).html();
    if (styleContent) {
      styleContent.split('}').forEach((rule) => {
        const [selector, properties] = rule.split('{');
        if (selector && properties) {
          const cleanedSelector = selector.trim();
          const propertyMap: any = {};
          properties.split(';').forEach((prop) => {
            const [key, value] = prop.split(':');
            if (key && value) {
              propertyMap[key.trim()] = value.trim();
            }
          });
          styles[cleanedSelector] = propertyMap;
        }
      });
    }
  });

  // Check elements with styles
  $('p, span, div').each((_, element) => {
    const text = $(element).text().trim();
    if (!text) return;

    const styleAttr = $(element).attr('style');
    let color: string = '';
    let backgroundColor: string = '';

    if (styleAttr) {
      const inlineStyles = styleAttr.split(';').reduce((acc, style) => {
        const [key, value] = style.split(':');
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
      }, {} as Record<string, string>);
      color = inlineStyles.color;
      backgroundColor = inlineStyles['background-color'];
    }

    // Check for classes with styles
    const classNames = $(element).attr('class');
    if (classNames) {
      classNames.split(' ').forEach((className) => {
        if (styles[`.${className}`]) {
          color = styles[`.${className}`].color || color;
          backgroundColor = styles[`.${className}`].backgroundColor || backgroundColor;
        }
      });
    }

    if (color && backgroundColor && !isContrastSufficient(color, backgroundColor)) {
      issues.push({
        issue: 'Text with insufficient color contrast',
        description: `The text "${text}" has poor contrast between color ${color} and background ${backgroundColor}.`,
        suggestion: 'Increase contrast between text and background colors for readability.',
        element: $.html(element),
      });
    }
  });

  return issues;
};
