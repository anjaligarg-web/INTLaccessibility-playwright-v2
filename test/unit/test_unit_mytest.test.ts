import fs from 'fs'
import path from 'path'
import { chromium, Browser } from 'playwright'
import { injectAxe, checkA11y, getViolations } from 'axe-playwright'
import { CreateCsvReporter } from '../../src/reporter/csvReport'
import { readUrlsFromExcel } from '../../src/readexcelUtil'

const excelFile = path.join(process.cwd(), 'testData/accessibilityUrls.xlsx')
const excelColumn = 'url'

const outputDir = path.join(process.cwd(), 'test-results', 'accessibility')
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

 const artifactDir = path.join(outputDir, 'artifacts')
//if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true })

const screenshotDir = path.join(outputDir, 'screenshots')
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true })

describe('Automated Accessibility report and screenshots', () => {
  let browser: Browser

  const urls = readUrlsFromExcel(excelFile, excelColumn)
  if (!urls || urls.length === 0) {
    it('should find at least one URL in Excel file', () => {
      throw new Error(`No URLs found in Excel file: ${excelFile}`)
    })
    return
  }

  beforeAll(async () => {
    browser = await chromium.launch()
    expect(browser).toBeTruthy()
  })

  afterAll(async () => {
    await browser.close()
  })

  for (const url of urls) {
    const safeName = url.replace(/https?:\/\//, '').replace(/[^\w.-]+/g, '_')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const HtmlReportFileName = `a11y-report-${safeName}-${timestamp}.html`
    const csvReportFileName = `accessibility-report-${safeName}-${timestamp}.csv`
    const screenshotFileName = `final-a11y-report-${safeName}-${timestamp}.png`
    const screenshotPath = path.join(screenshotDir, screenshotFileName)

    it(`a11y scan and screenshot for: ${url}`, async () => {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      expect(await page.title()).not.toBeNull()
      await injectAxe(page)

      await checkA11y(
        page,
        undefined,
        {
          detailedReport: true,
          detailedReportOptions: { html: true },
        },
        true,
        'html',
        {
          outputDirPath: outputDir,
          reportFileName: HtmlReportFileName,
        }
      )

      // Get violations for highlighting/screenshot
      const violations = await getViolations(page, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      })

      let screenshotLinkHtml = ''
      if (violations.length > 0) {
        // Highlight each failed node on the page
        for (const violation of violations) {
          for (const node of violation.nodes) {
            for (const selector of node.target) {
              if (typeof selector === 'string') {
                await page.evaluate(sel => {
                  try {
                    const el = document.querySelector(sel)
                    if (el) {
                     (el as HTMLElement).style.outline = '5px solid red';
                      (el as HTMLElement).style.backgroundColor = '#ffeeee'
                    }
                  } catch (e) {}
                }, selector)
              } else {
                console.log(`Skipped non-string selector: ${String(selector)}`)
              }
            }
          }
        }
        // Take screenshot with highlighted failures
        await page.screenshot({ path: screenshotPath, fullPage: true })
        screenshotLinkHtml = `
            <div>
              <strong>Screenshot of Violations:</strong>
              <a href="../screenshots/${screenshotFileName}" target="_blank">View Screenshot</a>
            </div>
        `
      }

      // Read HTML report, wrap with URL and screenshot info
      const axeHtml = fs.readFileSync(path.join(artifactDir, HtmlReportFileName), 'utf-8')
      const htmlContent = `
        <html>
          <body>
            <h2>Accessibility Test Result</h2>
            <div>
              <strong>Tested URL:</strong>
              <a href="${url}" target="_blank">${url}</a>
            </div>
            ${screenshotLinkHtml}
            <hr/>
            ${axeHtml}
          </body>
        </html>
      `
      // Overwrite the report to add screenshot info
      fs.writeFileSync(path.join(artifactDir, HtmlReportFileName), htmlContent)

      // Write CSV
      require('axe-playwright').reportViolations(violations, new CreateCsvReporter(path.join(outputDir, csvReportFileName)))

      // Log summary for audit
      console.log(
        `URL: ${url}\nSaved HTML report: ${HtmlReportFileName}\nScreenshot: ${violations.length > 0 ? screenshotFileName : 'No violations'}\nViolations: ${violations.length}`
      )
      expect(violations.length).toBe(0)
      await page.close()
    })
  }
})