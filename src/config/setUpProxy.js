const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/",
    createProxyMiddleware({
      target: process.env.REACT_APP_BACK_URL,
      changeOrigin: true,
    })
  );
};
