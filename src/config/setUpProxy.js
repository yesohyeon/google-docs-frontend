const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/",
    createProxyMiddleware({
      target: process.env.REACT_APP_BACK_URL,
      changeOrigin: true,
    })
  );
};
