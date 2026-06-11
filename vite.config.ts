import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/proxy': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const [, queryStr = ''] = proxyReq.path.split('?')
              const qs = new URLSearchParams(queryStr)
              const tmdbPath = qs.get('path') ?? ''
              qs.delete('path')
              qs.set('api_key', env.TMDB_API_KEY ?? '')
              proxyReq.path = `/${tmdbPath}?${qs.toString()}`
            })
          },
        },
      },
    },
  }
})
