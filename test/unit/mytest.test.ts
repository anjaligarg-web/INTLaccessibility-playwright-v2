import { chromium, Browser, Page } from 'playwright'
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'
import { YourAwesomeCsvReporter } from '../../src/reporter/csvReport';


let browser: Browser
let page: Page

describe('Playwright web page accessibility test', () => {
  beforeAll(async () => {
    browser = await chromium.launch()
    expect(browser).toBeTruthy();
    page = await browser.newPage()
    //await page.goto(`file://${process.cwd()}/test/site.html`)   
    await page.goto(`https://www.mheducation.ca`)     

    expect(await page.title()).not.toBeNull();
    await injectAxe(page)
  })

  it('simple accessibility run', async () => {
    await checkA11y(page)
  })

  it('check a11y for the whole page and axe run options', async () => {
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a','wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    })
  })

  it('check a11y for the specific element', async () => {
    await checkA11y(page, 'input[name="password"]', {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a'],
        },
      },
    })
  })

  it('gets and reports a11y for the specific element', async () => {
    const violations = await getViolations(page, undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a','wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    })

    console.log("violation...." + violations);

    reportViolations(violations, new YourAwesomeCsvReporter('accessibility-report.csv'))

    expect(violations.length).toBe(0)
  })

  afterAll(async () => {
    await browser.close()
  })
})