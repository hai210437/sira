import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Environment Variablen laden
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
            // Entferne mögliche Anführungszeichen aus dem Passwort
            const password = (env.VITE_API_PASSWORD || 'Sira#1010').replace(/^["']|["']$/g, '');
            const auth = Buffer.from(`${username}:${password}`).toString('base64');

            // Debug: Zeige Credentials (nur zur Fehlersuche!)
            console.log('🔑 Vite Proxy Config:');
            console.log('  Username:', username);
            console.log('  Password:', password ? '***' + password.slice(-4) : 'NICHT GESETZT');
            console.log('  Base64:', auth);

            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // Authorization Header IMMER setzen, auch wenn Client einen mitschickt
              proxyReq.setHeader('Authorization', `Basic ${auth}`);
              console.log('🔐 Proxy Request:', req.url);
              console.log('   Authorization: Basic', auth);
            });

            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('📡 Proxy Response:', proxyRes.statusCode, req.url);
              if (proxyRes.statusCode === 401) {
                console.error('❌ 401 Unauthorized - Credentials falsch!');
              }
            });
          }
        }
      },
    },
  }
})
