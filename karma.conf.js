'use strict';
const path = require('path');
const project = require('./aurelia_project/aurelia.json');
const karmaConfig = project.unitTestRunners.find(x => x.id === 'karma');
let testSrc = [
  { pattern: karmaConfig.source, included: false },
  'test/aurelia-karma.js',
  'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
];

let output = project.platform.output;
let appSrc = project.build.bundles.map(x => path.join(output, x.name));
let entryIndex = appSrc.indexOf(path.join(output, project.build.loader.configTarget));
let entryBundle = appSrc.splice(entryIndex, 1)[0];
let sourceMaps = [{pattern:'scripts/**/*.js.map', included: false}];
let mockFiles = [{pattern: 'test/mockdata/*.json', watched: true, served: true, included: false}];
let imgPNG = [{pattern: 'img/**/*.png', watched: false, served: true, included: false}];
let imgSVG = [{pattern: 'img/**/*.svg', watched: false, served: true, included: false}];
let files = [entryBundle]
  .concat(testSrc)
  .concat(appSrc)
  .concat(sourceMaps)
  .concat(mockFiles)
  .concat(imgPNG)
  .concat(imgSVG);

let transpilerOptions = project.transpiler.options;
transpilerOptions.sourceMap = 'inline';
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: [project.testFramework.id],
    files: files,
    exclude: [],
    preprocessors: {
      [karmaConfig.source]: [project.transpiler.id],
      [appSrc]: ['sourcemap']
    },
    'babelPreprocessor': { options: transpilerOptions },
    reporters: ['verbose','json-result','spec'],
    jsonResultReporter: {
      outputFile: "karma-result.json",
      isSynchronous: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    flags: [
      '--disable-web-security',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--remote-debugging-port=9222',
    ],
    singleRun: true,
    // client.args must be a array of string.
    // Leave 'aurelia-root', project.paths.root in this order so we can find
    // the root of the aurelia project.
    client: {
      args: ['aurelia-root', project.paths.root]
    }
  });
};
