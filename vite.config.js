import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    assetsInlineLimit: 0, // Ensures fonts are copied as files
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'ÁvilaVenturas',
        short_name: 'ÁvilaVenturas',
        description: 'Experiencias al aire libre en el Parque Nacional El Ávila',
        theme_color: '#1a2a1a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'android-chrome-192x192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png', 
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,woff,woff2,webp,jpg,jpeg}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
        ]
      }
    })
  ]
})