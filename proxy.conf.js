const { startServer } = require('./backend/server');

startServer({
  host: process.env.API_HOST || '127.0.0.1',
  port: Number(process.env.API_PORT || 3000),
  allowExisting: true,
  exitOnError: false,
});

module.exports = {
  '/api': {
    target: `http://${process.env.API_HOST || '127.0.0.1'}:${process.env.API_PORT || 3000}`,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};
