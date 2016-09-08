var SystemBuilder = require('systemjs-builder');
var builder = new SystemBuilder();

builder.loadConfig('./system.config.js')
    .then(function() {
      return builder.bundle(
          'app - dist/vendor/lib-bundle.js',
          'dist/app/app-bundle.js',
          // NOTE: minify is set to false for sample purposes to make it easier to perform minimal customization of
          // deployed code without requiring a build
          { minify: false, sourceMaps: true, lowResSourceMaps: true });
    })
    .then(function() {
      console.log('Application bundle built successfully');
    });
