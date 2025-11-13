import fs from 'fs'
import path from 'path'
import { chromium, Browser, Page } from 'playwright'
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'
import { CreateCsvReporter } from '../../src/reporter/csvReport';


let browser: Browser
let page: Page
const url = 'https://www.mheducation.co.uk/schools'; // your scanned URL
const outputDir = path.join(process.cwd(), 'test-results', 'accessibility');
const reportFileName = 'a11y-report.html';
const reportPath = path.join(outputDir, reportFileName);
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

describe('Playwright web page accessibility test', () => {
  beforeAll(async () => {
    browser = await chromium.launch()
    expect(browser).toBeTruthy();
    page = await browser.newPage()
    //await page.goto(`file://${process.cwd()}/test/site.html`)   
    await page.goto(url)     

    expect(await page.title()).not.toBeNull();
    await injectAxe(page)
  })


  it('check a11y for the whole page and axe run options', async () => {

    const safeName = url.replace(/https?:\/\//, '').replace(/[^\w.-]+/g, '_');
    await checkA11y(
        page,
        undefined, // <-- or remove this line entirely
        {
          detailedReport: true,
          detailedReportOptions: { html: true },
        },
        true,  // skipFailures
        'html',
        {
           outputDirPath: 'test-results/accessibility',
           reportFileName: `a11y-report-${safeName}-${timestamp}.html`,           
        }
      );
  })

 /* it('check a11y for the specific element', async () => {
    await checkA11y(page, 'input[name="password"]', {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a'],
        },
      },
    })
  })*/

  it('gets and reports a11y for the specific element', async () => {
    const violations = await getViolations(page, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a','wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    })

    console.log("violation...." + violations);

    reportViolations(violations, new CreateCsvReporter('accessibility-report.csv'))
    

    expect(violations.length).toBe(0)
  })

  afterAll(async () => {
    await browser.close()
  })
})