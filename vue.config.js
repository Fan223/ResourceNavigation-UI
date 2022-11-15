const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8083,
    proxy: {
      '/reNav': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
    }
  }
})
