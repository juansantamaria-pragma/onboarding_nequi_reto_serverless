const reporters = require('jasmine-reporters');
let originalTimeout;

beforeEach(function () {
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
});

afterEach(function () {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
});

let junitReporter = new reporters.JUnitXmlReporter({
  savePath: 'reports',
  filePrefix: 'TEST-',
  consolidateAll: false
});

jasmine.getEnv().addReporter(junitReporter);