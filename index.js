require('./bootstrap');
require('./lib/app');

// Run the worker in the web process in debug mode
if (process.env.APP_DEBUG) {
  require('./worker');
}
