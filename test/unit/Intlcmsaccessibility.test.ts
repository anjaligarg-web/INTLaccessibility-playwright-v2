import { chromium, Browser, Page } from 'playwright'
import { injectAxe, checkA11y } from 'axe-playwright'

let browser: Browser
let page: Page

describe('Playwright web page accessibility test', () => {
  beforeAll(async () => {
    browser = await chromium.launch()
    page = await browser.newPage()
    await page.goto(`https://www.mheducation.co.uk/schools`)   
    await injectAxe(page)
  })

  // Prints outs a detailed report per node with an array of numbers of which violations from the summary affect that node
  it('print out a detailed report on violations', async () => {
    await checkA11y(page, {
      detailedReport: true,
    })
  })

  // Same as above, but includes the html of the offending node
  it('print out a detailed report on violations', async () => {
    await checkA11y(
      page,
      'form',
      {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a'],
          },
        },
      },
      true,
      'html',
      {
        outputDirPath: 'C:\\Users\\firstname_lastname\\Documents\\axe-playwright-INTL\\test-results',
        outputDir: 'accessibility',
        reportFileName: 'accessibility-audit.html'
      }
    )
  })

  afterAll(async () => {
    await browser.close()
  })
})