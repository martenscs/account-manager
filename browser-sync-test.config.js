module.exports = {
  files: ['dist/app/app-bundle.js', 'dist/css/*.css', 'app/**/*.html'], // 'dist/app/**/*.spec.js'
  port: 3008,
  server: {
    middleware: {
      // overrides the second middleware default with new settings
      1: require('connect-history-api-fallback')({ index: '/test.html' })
    }
  }
};
