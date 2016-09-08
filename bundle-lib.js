var SystemBuilder = require('systemjs-builder');
var builder = new SystemBuilder();

builder.loadConfig('./system.config.js')
    .then(function() {
      // build app and remove the app code - this leaves only external dependencies
      return builder.bundle(
          'app - [dist/app/**/*]',
          'dist/vendor/lib-bundle.js',
          { minify: true, sourceMaps: false });
    })
    .then(function() {
      console.log('Library bundle built successfully');
    });
