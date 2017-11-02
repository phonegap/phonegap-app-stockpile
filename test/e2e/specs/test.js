// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
let devServer;

module.exports = {
  before: (browser) => {
    console.log('Setting up...');
    devServer = browser.globals.devServerURL;
  },
  'main view': (browser) => {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('#main-view');
  },
  'nav bar': (browser) => {
    browser
      .url(devServer)
      .waitForElementVisible('.view-main .navbar-inner .center', 5000)
      .assert.containsText('.view-main .navbar-inner .center', 'Search');
  },
  'content block title': (browser) => {
    browser
      .url(devServer)
      .waitForElementVisible('.view-main .page-content .content-block-title', 5000)
      .assert.containsText('.view-main .page-content .content-block-title', 'Search for Stock images by keyword');
  },
  'content block': (browser) => {
    browser
      .url(devServer)
      .waitForElementVisible('.view-main .page-content .content-block', 5000)
      .assert.containsText('.view-main .page-content .content-block', 'FIND IMAGES')
      .end();
  }
};
