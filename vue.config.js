const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8083,
    proxy: {
      '/resNav': {
        target: 'http://localhost:8881',
        ws: true,
        changeOrigin: true,
      },
    }
  }
})
