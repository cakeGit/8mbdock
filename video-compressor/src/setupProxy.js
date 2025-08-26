module.exports = function(app) {
  // Add COOP and COEP headers for all requests to enable SharedArrayBuffer
  app.use(function(req, res, next) {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });
};
