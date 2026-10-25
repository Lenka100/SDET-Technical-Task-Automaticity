# PrestaShop Registration Tests

Automated tests for the registration functionality on the PrestaShop demo website, written with Playwright and TypeScript as part of a Junior SDET technical assignment.

The project uses the Page Object Model (POM) to keep page locators and reusable actions separate from test scenarios and assertions.

## Test coverage

The registration suite contains six scenarios:

| Scenario | Main check |
| --- | --- |
| Successful registration with valid required data | The user menu displays the registered user's first name and last name. |
| Empty required fields | Required text fields and consent checkboxes are invalid. |
| Already registered email address | A second registration with the same email displays the duplicate-email error. |
| Weak password | The password validation message states that the password is too weak. |
| Invalid email format | An email address without `@` is invalid. |
| Missing required consents | Registration without selecting the required consents leaves the terms checkbox invalid. |

These scenarios cover the main successful registration flow and selected validation failures. They are not an exhaustive test of every field or optional preference.

## Prerequisites

- Node.js LTS and npm.
- Internet access to the public PrestaShop demo website.

## Installation

Clone or download the repository, then open a terminal in the project root, where `package.json` and `package-lock.json` are located.

Install the project dependencies:

```bash
npm ci
```

Install the Playwright browser binaries:

```bash
npx playwright install
```

On Linux, if browser system dependencies are missing, use:

```bash
npx playwright install --with-deps
```

No local application server, existing user account, or environment file is required.

## Running the tests

Run the six registration tests in Chromium:

```bash
npx playwright test tests/registration.spec.ts --project=chromium
```

Open UI mode for the registration suite:

```bash
npx playwright test tests/registration.spec.ts --ui
```

In UI mode, choose the desired browser project and use the run button next to an individual test or the Registration group.

Run in Chromium with a visible browser window:

```bash
npx playwright test tests/registration.spec.ts --project=chromium --headed
```

Run the registration suite across all three configured browsers:

```bash
npx playwright test tests/registration.spec.ts
```

The configuration includes Chromium, Firefox, and WebKit, so this command schedules 18 test cases: six scenarios for each browser project. Browser configuration does not by itself confirm that every scenario has passed in every browser.

To run all test files in the repository:

```bash
npx playwright test
```

## Test report

The HTML reporter is configured in `playwright.config.ts`. After a run, open the report with:

```bash
npx playwright show-report
```

The report is written to `playwright-report/`. Playwright uses `test-results/` for test artifacts.

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions workflow
├── pages/
│   └── RegistrationPage.ts      # Locators and reusable page actions
├── tests/
│   └── registration.spec.ts     # Six registration scenarios and assertions
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts         # Browser projects, reporting and CI settings
├── tsconfig.json                # TypeScript configuration
└── README.md
```

## Test approach

- Tests are grouped in a `Registration` describe block.
- Before each test, `beforeEach` creates a `RegistrationPage` object and opens the registration form.
- Navigation starts at `https://demo.prestashop.com/#/en/front`, then follows **Sign in → Create your account**.
- The demo shop is displayed inside the `#framelive` iframe. A `FrameLocator` scopes shop interactions to that frame, avoiding a hard-coded temporary shop subdomain.
- The POM provides separate methods for filling fields, accepting required consents, submitting registration, and signing out.
- Tests that need a new account use timestamp-based email addresses on `example.com`.
- The duplicate-email scenario creates its own account, signs out, and retries registration with the same saved email. It does not depend on another test.
- Assertions check the signed-in user's name, application error messages, and native form validation states through the CSS `:invalid` pseudo-class.

## Continuous integration

The GitHub Actions workflow runs on pushes and pull requests targeting `main` or `master`. It installs Node.js LTS, project dependencies, browser binaries and system dependencies, then runs all test files in all configured browser projects.

In CI, the Playwright configuration uses one worker and up to two retries. A trace is collected on the first retry, and the workflow uploads the HTML report as an artifact with a 30-day retention period.

Locally, retries are disabled by default. Therefore, a failed local run does not automatically create a first-retry trace.

## Demo environment considerations

The suite depends on an external public demo. Shop provisioning, server availability, changing content, or network delays can affect test runs. The tests expect the English storefront and its current iframe and form structure.

If several parallel tests overload the demo, run the registration suite with one worker:

```bash
npx playwright test tests/registration.spec.ts --project=chromium --workers=1
```

Investigate failures using the report or UI mode before rerunning them; a retry alone does not resolve an underlying test or environment issue.

The tests create accounts in the demo environment and do not delete them afterwards. Timestamp-based addresses reduce email reuse but are not a guaranteed unique identifier across simultaneous runs.

The POM includes helpers for optional fields and preferences, but the current suite does not exercise all of those helpers. The missing-consent scenario checks the terms checkbox; it does not independently verify each required consent.
