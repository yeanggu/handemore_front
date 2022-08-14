const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (app) => {
    app.use(
        '/handemore',
        createProxyMiddleware({
            target: "http://localhost:8083",
            changeOrigin: true
        })
    );
};
