import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'https://ftp.sira-group.at',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy, _options) => {
            const username = env.VITE_API_USERNAME || 'admin';
            const password = (env.VITE_API_PASSWORD || 'Sira#1010').replace(/^["']|["']$/g, '');
            const auth = Buffer.from(`${username}:${password}`).toString('base64');

            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Basic ${auth}`);
            });
          }
        }
      },
    },
  }
})
