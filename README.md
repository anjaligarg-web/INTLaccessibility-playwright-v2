# 💡 Playwright Accessibility Automation Framework

This project is a starter kit for **accessibility testing automation** using **Playwright** and **axe-core**. It supports testing against **WCAG 2.0/2.1** compliance, includes **HTML/JSON reports**, and takes **screenshots** of violations with proper impact categorization.

---

## ✅ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   For accessibility testing, make sure these dev dependencies are installed:

   ```bash
   npm install @axe-core/playwright axe-html-reporter open playwright --save-dev
   npm install xlsx jira.js
   ```

3. **Environment setup:**

   * Create `.env` files under the `env/` directory such as `.env.API`, `.env.UI`, etc.
   * Add relevant environment variables as needed.

---

## 🎯 Accessibility Testing

Accessibility testing is powered by **@axe-core/playwright** and seamlessly integrated into UI flows.

### 🔎 What It Does:

* Uses `AxeBuilder` from `@axe-core/playwright` to scan each page.
* Focuses on **WCAG 2.0 & WCAG 2.1 AA** compliance.
* Ignores noisy rules (like color-contrast) by default.
* Generates:

  * 📄 HTML Report
  * 📁 JSON Log
  * 📷 Screenshot of violation (critical/major issues)

---

### ▶️ How to Run Accessibility Tests:

```bash
npm run test:accessibility
npx playwright test tests/UI/mheducationAccessibility.spec.ts
```

> This will invoke the utility that scans the current page, saves a violation screenshot, and generates reports in a timestamped folder.

---

## 📁 Accessibility Reports

Reports are saved inside the `accessibility-reports/` directory and include:

| File Type | Description                           |
| --------- | ------------------------------------- |
| `.html`   | Rich interactive report per test      |
| `.json`   | Raw accessibility results             |
| `.png`    | Screenshot of the violating UI region |

### ✅ Example:

```
accessibility-reports/
├── User_is_able_to_login_with_valid_credential-2025-07-15T05-40-09-958Z.html
├── User_is_able_to_login_with_valid_credential-2025-07-15T05-40-09-958Z.json
├── User_is_able_to_login_with_valid_credential-2025-07-15T05-40-09-958Z.png
```

---

## 📚 Folder Structure

```
project-root/
├── accessibility-reports/       # All accessibility scan reports
├── playwright-report/           # Playwright HTML reports
├── logs/                        # all.log, error.log for traceability
├── test-data/                   # Test data in JSON format
├── suites/                      # All test cases
│   └── UI
├── page-objects/                # Page Object Models
├── utils/                       # Shared utilities like axeHelper, logger
└── playwright.config.ts         # Playwright configuration
```

---

## 📜 Shell Script Execution

Shell scripts (e.g., for token generation or pre-test setup) can be added and executed from within test lifecycle hooks. Example:

```bash
bash ./scripts/token-generator.sh
```

---

## 📦 Logging

Logs are written to the `/logs` folder:

* `all.log`: All debug + info logs
* `error.log`: Error-only entries

---
## 🛠️ Automation & Maintenance Workflows

This repository uses GitHub Actions for continuous automation and robust project maintenance.

**When to use these workflows:**
- If your project uses npm (Node.js/TypeScript):
  - `dependabot.yml` keeps your dependencies up-to-date and secure—essential for modern CI/CD and security best practices.
  - `npm-release.yml` automates build, versioning, and publishing, enabling fast, reliable, and repeatable releases.

| File               | Use Case                                 | Benefits & Best Practices            |
|--------------------|------------------------------------------|--------------------------------------|
| `npm-release.yml`  | Automate build, test, version, npm publish| Reliable, repeatable releases        |
| `dependabot.yml`   | Automate dependency updates (npm)         | Security patches, fresh dependencies |

*Implement both for robust automation and ongoing maintenance in any actively developed repo!*

---

## 📹 Video & Screenshot Support

* All test runs are optionally captured as video.
* Accessibility violations are captured as PNG for visual traceability.

---


---
