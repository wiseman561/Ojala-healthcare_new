const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 30000,
  video: true,
  screenshotOnRunFailure: true,
  chromeWebSecurity: false,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports/mocha',
      quite: true,
      overwrite: false,
      html: false,
      json: true
    }
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    apiUrl: 'http://localhost:5000',
    // User credentials should be loaded from environment variables or cypress.env.json
    // which should be added to .gitignore to prevent committing secrets
    adminUsername: process.env.CYPRESS_ADMIN_USERNAME || 'admin@ojala-healthcare.com',
    adminPassword: process.env.CYPRESS_ADMIN_PASSWORD,
    rnUsername: process.env.CYPRESS_RN_USERNAME || 'nurse@ojala-healthcare.com',
    rnPassword: process.env.CYPRESS_RN_PASSWORD,
    mdUsername: process.env.CYPRESS_MD_USERNAME || 'doctor@ojala-healthcare.com',
    mdPassword: process.env.CYPRESS_MD_PASSWORD,
    employerUsername: process.env.CYPRESS_EMPLOYER_USERNAME || 'employer@ojala-healthcare.com',
    employerPassword: process.env.CYPRESS_EMPLOYER_PASSWORD,
    patientUsername: process.env.CYPRESS_PATIENT_USERNAME || 'patient@ojala-healthcare.com',
    patientPassword: process.env.CYPRESS_PATIENT_PASSWORD
  }
})
