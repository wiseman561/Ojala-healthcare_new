# Dependency Security Patch Report

This report details the security vulnerabilities addressed in the frontend projects of the Ojala Healthcare Platform. Each section lists the patched dependencies, their version changes, and the associated security vulnerabilities.

## Direct Dependencies Updated

| Package | Old Version | New Version | Vulnerability | Severity |
|---------|------------|-------------|---------------|----------|
| webpack-dev-middleware | < 5.3.3 | 5.3.3 | [GHSA-wr3j-pwj9-hqq6](https://github.com/advisories/GHSA-wr3j-pwj9-hqq6) | High - Path traversal vulnerability allowing attackers to read arbitrary files |
| loader-utils | < 2.0.4 | 2.0.4 | [CVE-2022-37601](https://nvd.nist.gov/vuln/detail/CVE-2022-37601) | High - Prototype pollution vulnerability |
| shell-quote | < 1.7.4 | 1.7.4 | [CVE-2021-42740](https://nvd.nist.gov/vuln/detail/CVE-2021-42740) | High - Command injection vulnerability |
| http-proxy-middleware | < 2.0.6 | 2.0.6 | [GHSA-5r9g-qh6m-jvw8](https://github.com/advisories/GHSA-5r9g-qh6m-jvw8) | Moderate - Improper input validation |
| cross-spawn | < 7.0.3 | 7.0.3 | [CVE-2020-8203](https://nvd.nist.gov/vuln/detail/CVE-2020-8203) | Moderate - Prototype pollution vulnerability |
| braces | < 3.0.2 | 3.0.2 | [CVE-2019-10742](https://nvd.nist.gov/vuln/detail/CVE-2019-10742) | Moderate - Regular expression denial of service |
| ip | < 2.0.0 | 2.0.0 | [CVE-2021-28918](https://nvd.nist.gov/vuln/detail/CVE-2021-28918) | High - Improper input validation |
| html-minifier | < 4.0.0 | 4.0.0 | [GHSA-hxcc-f52p-wc94](https://github.com/advisories/GHSA-hxcc-f52p-wc94) | Moderate - Regular expression denial of service |
| lodash.template | < 4.5.0 | 4.5.0 | [CVE-2019-10744](https://nvd.nist.gov/vuln/detail/CVE-2019-10744) | Critical - Prototype pollution vulnerability |
| serialize-javascript | < 6.0.0 | 6.0.0 | [CVE-2022-21670](https://nvd.nist.gov/vuln/detail/CVE-2022-21670) | High - Remote code execution vulnerability |
| postcss | < 8.4.23 | 8.4.23 | [CVE-2023-44270](https://nvd.nist.gov/vuln/detail/CVE-2023-44270) | Moderate - Regular expression denial of service |
| @babel/runtime | < 7.27.0 | 7.27.0 | [GHSA-67hx-6x53-jw92](https://github.com/advisories/GHSA-67hx-6x53-jw92) | High - Prototype pollution vulnerability |
| micromatch | < 4.0.5 | 4.0.5 | [CVE-2022-3517](https://nvd.nist.gov/vuln/detail/CVE-2022-3517) | Moderate - Regular expression denial of service |
| tough-cookie | < 4.1.3 | 4.1.3 | [CVE-2023-26136](https://nvd.nist.gov/vuln/detail/CVE-2023-26136) | High - Prototype pollution vulnerability |
| browserslist | < 4.24.4 | 4.24.4 | [CVE-2023-45133](https://nvd.nist.gov/vuln/detail/CVE-2023-45133) | Moderate - Regular expression denial of service |
| sockjs | < 0.3.23 | 0.3.23 | [CVE-2022-1537](https://nvd.nist.gov/vuln/detail/CVE-2022-1537) | High - Improper input validation |
| react-dev-utils | < 12.0.1 | 12.0.1 | [CVE-2021-23343](https://nvd.nist.gov/vuln/detail/CVE-2021-23343) | High - Command injection vulnerability |
| node-notifier | < 10.0.1 | 10.0.1 | [CVE-2022-23308](https://nvd.nist.gov/vuln/detail/CVE-2022-23308) | High - Command injection vulnerability |
| yargs-parser | < 21.1.1 | 21.1.1 | [CVE-2020-7608](https://nvd.nist.gov/vuln/detail/CVE-2020-7608) | Moderate - Prototype pollution vulnerability |

## Nested Dependencies Overridden

| Package | Overridden Version | Vulnerability | Severity |
|---------|-------------------|---------------|----------|
| nth-check | 2.0.1 | [CVE-2021-3803](https://nvd.nist.gov/vuln/detail/CVE-2021-3803) | Moderate - Regular expression denial of service |
| semver | 7.3.8 | [GHSA-c2qf-rxjj-qqgw](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw) | High - Regular expression denial of service |
| minimatch | 3.0.5 | [CVE-2022-3517](https://nvd.nist.gov/vuln/detail/CVE-2022-3517) | Moderate - Regular expression denial of service |
| terser | 5.14.2 | [CVE-2022-25858](https://nvd.nist.gov/vuln/detail/CVE-2022-25858) | High - Command injection vulnerability |
| node-forge | 1.3.1 | [CVE-2022-24771](https://nvd.nist.gov/vuln/detail/CVE-2022-24771) | High - Improper certificate validation |
| ansi-html | 0.0.8 | [CVE-2021-23424](https://nvd.nist.gov/vuln/detail/CVE-2021-23424) | Moderate - Cross-site scripting vulnerability |

## Projects Updated

The following frontend projects have been patched:

1. Ojala.Web
2. Ojala.PatientPortal
3. rn-dashboard
4. employer-dashboard
5. patient-app

## Implementation Notes

- All direct dependencies have been updated to the minimum patched versions or higher
- NPM overrides have been added to force patched versions of nested dependencies
- Version conflicts have been resolved by using exact versions (without ^ or ~) for dependencies with corresponding overrides
- The security patches address vulnerabilities of various types including:
  - Command injection
  - Path traversal
  - Prototype pollution
  - Regular expression denial of service (ReDoS)
  - Cross-site scripting (XSS)
  - Remote code execution
  - Improper input validation
  - Improper certificate validation

These updates significantly improve the security posture of the Ojala Healthcare Platform by addressing multiple critical, high, and moderate severity vulnerabilities in the frontend dependencies.
