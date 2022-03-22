const config = require('./jest.config');

module.exports = {
  ...config,
  collectCoverage: true,
  coverageReporters: ['json-summary', 'lcov'],
};
