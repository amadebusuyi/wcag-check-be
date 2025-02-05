import { analyzeHTML } from '../src/services/accessibilityService';

describe('Accessibility Service', () => {
  beforeAll(() => {
    jest.setTimeout(30000); // 30 seconds timeout for all tests in this suite
  });

  const runAccessibilityTest = async (html: string) => {
    try {
      return await analyzeHTML(html);
    } catch (error) {
      console.error('Error analyzing HTML:', error);
      throw error; // Rethrow if an error occurs
    }
  };

  it('should return a compliance score of 100 when no issues are found', async () => {
    const html = `
      <html lang="en">
        <head>
          <title>Accessibility Check</title>
        </head>
        <body>
          <img src="image.jpg" alt="An image">
          <h1>Title</h1>
          <p>Some text</p>
        </body>
      </html>
    `;
    const result = await runAccessibilityTest(html);
    expect(result.complianceScore).toBe(100);
    expect(result.issues).toHaveLength(0);
  });

  it('should detect compliance issues', async () => {
    const html = `
      <html lang="en">
        <head>
          <title>Accessibility Check</title>
        </head>
        <body>
          <img src="image.jpg">
          <h1>Title</h1>
        </body>
      </html>
    `;
    const result = await runAccessibilityTest(html);
    expect(result.complianceScore).toBeLessThan(100);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          issue: expect.any(String),
          severity: expect.stringMatching(/critical|high|medium|low/),
          weight: expect.any(Number),
          description: expect.any(String),
          suggestion: expect.any(String),
          element: expect.any(Object),
        }),
      ]),
    );
  });
});
