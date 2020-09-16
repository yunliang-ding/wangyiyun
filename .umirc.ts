import { defineConfig } from 'umi';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '/image/favicon.png',
  title: '简听',
  proxy: {
    '/api': {
      target: 'http://182.92.240.91:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
