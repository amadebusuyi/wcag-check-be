import { analyzeHTML } from '../src/services/accessibilityService';

describe('Accessibility Service', () => {
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
    const result = await analyzeHTML(html, true);
    expect(result.complianceScore).toBe(100);
    expect(result.issues).toHaveLength(0);
  });

  it('should detect missing alt attribute on an image', async () => {
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
    const result = await analyzeHTML(html, true);
    expect(result.complianceScore).toBeLessThan(100);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          issue: 'Missing alt attribute on <img> tag',
        }),
      ]),
    );
  });

  it('should detect improper heading structure issue', async () => {
    const html = `
      <html lang="en">
        <head>
          <title>Accessibility Check</title>
        </head>
        <body>
          <h2>Subheading without H1</h2>
          <p>Paragraph text</p>
        </body>
      </html>
    `;
    const result = await analyzeHTML(html, true);
    expect(result.complianceScore).toBeLessThan(100);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          issue: 'Improper heading structure',
        }),
      ]),
    );
  });
  it('should detect heading hierarchy issues', async () => {
    const html = `
      <html lang="en">
        <head>
          <title>Accessibility Check</title>
        </head>
        <body>
          <h1>Subheading with H1</h1>
          <h3>Subheading with H3</h3>
          <h2>Subheading with H2</h2>
          <p>Paragraph text</p>
        </body>
      </html>
    `;
    const result = await analyzeHTML(html, true);
    expect(result.complianceScore).toBeLessThan(100);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          issue: 'Heading levels are not in a proper sequence',
        }),
      ]),
    );
  });
});

it('should detect missing <title> tag', async () => {
  const html = `
    <html lang="en">
      <head></head>
      <body>
        <h1>Page Title</h1>
        <p>Content here</p>
      </body>
    </html>
  `;
  const result = await analyzeHTML(html, true);
  expect(result.complianceScore).toBeLessThan(100);
  expect(result.issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        issue: 'Missing <title> tag',
      }),
    ]),
  );
});

it('should detect missing lang attribute on <html> tag', async () => {
  const html = `
    <html>
      <head>
        <title>Sample Page</title>
      </head>
      <body>
        <h1>Page Title</h1>
        <p>Content here</p>
      </body>
    </html>
  `;
  const result = await analyzeHTML(html, true);
  expect(result.complianceScore).toBeLessThan(100);
  expect(result.issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        issue: 'Missing lang attribute on <html> tag',
      }),
    ]),
  );
});

it('should detect non-descriptive link text', async () => {
  const html = `
    <html lang="en">
      <head>
        <title>Sample Page</title>
      </head>
      <body>
        <h1>Page Title</h1>
        <p>For more information, <a href="details.html">click here</a>.</p>
      </body>
    </html>
  `;
  const result = await analyzeHTML(html, true);
  expect(result.complianceScore).toBeLessThan(100);
  expect(result.issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        issue: 'Non-descriptive link text',
      }),
    ]),
  );
});

it('should detect form elements without labels', async () => {
  const html = `
    <html lang="en">
      <head>
        <title>Sample Form</title>
      </head>
      <body>
        <h1>Registration Form</h1>
        <form>
          <input type="text" name="username" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `;
  const result = await analyzeHTML(html, true);
  expect(result.complianceScore).toBeLessThan(100);
  expect(result.issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        issue: 'Form elements without associated labels',
      }),
    ]),
  );
});

it('should detect text with insufficient color contrast', async () => {
  const html = `
    <html lang="en">
      <head>
        <title>Sample Page</title>
        <style>
          .low-contrast {
            
          }
        </style>
      </head>
      <body>
        <h1>Page Title</h1>
        <p style="color: #ccc; background-color: #fff;">This is hard to read text.</p>
      </body>
    </html>
  `;
  const result = await analyzeHTML(html, true);
  expect(result.complianceScore).toBeLessThan(100);
  expect(result.issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        issue: 'Text with insufficient color contrast',
      }),
    ]),
  );
});
