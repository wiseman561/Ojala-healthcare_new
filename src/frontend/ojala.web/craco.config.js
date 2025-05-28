// craco.config.js

module.exports = {
  eslint: {
    // Disable CRACO's ESLint integration
    enable: false,
  },
  webpack: {
    configure: (config) => {
      // Patch for fullySpecified loader issue
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOf) => {
            if (oneOf.test && oneOf.test.toString().includes("js")) {
              oneOf.resolve = { fullySpecified: false };
            }
          });
        }
      });
      return config;
    },
  },
  babel: {
    plugins: [
      ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
    ],
  },
  jest: {
    configure: (jestConfig, { env, paths, resolve, rootDir }) => {
      jestConfig.transformIgnorePatterns = [
        "[/\\\\]node_modules[/\\\\](?!axios).+\\.(js|jsx|ts|tsx)$",
        "^.+\\.module\\.(css|sass|scss)$",
        "/node_modules/(?!(@ojala|react-native|react-native-.*|@react-native-.*)/)"
      ];
      jestConfig.collectCoverage = true;
      jestConfig.coverageReporters = [
        "json",
        "lcov",
        "text",
        "clover",
        "text-summary",
      ];
      jestConfig.coverageDirectory = "coverage";
      jestConfig.coverageThreshold = {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      };
      return jestConfig;
    },
  },
};
