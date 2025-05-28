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
    adminUsername: 'admin@ojala-healthcare.com',
    adminPassword: 'admin-password',
    rnUsername: 'nurse@ojala-healthcare.com',
    rnPassword: 'nurse-password',
    mdUsername: 'doctor@ojala-healthcare.com',
    mdPassword: 'doctor-password',
    employerUsername: 'employer@ojala-healthcare.com',
    employerPassword: 'employer-password',
    patientUsername: 'patient@ojala-healthcare.com',
    patientPassword: 'patient-password'
  }
})
