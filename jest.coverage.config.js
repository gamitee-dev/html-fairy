const config = require('./jest.config');

module.exports = {
  ...config,
  collectCoverage: true,
  coverageReporters: ['json-summary', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
