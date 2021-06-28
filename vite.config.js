// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Endurance Point',
        short_name: 'EnduPoint',
        theme_color: '#3b82d8',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon_x36.png',
            sizes: '36x36',
            type: 'image/png',
            density: '0.75'
          },
          {
            src: 'icons/icon_x48.png',
            sizes: '48x48',
            type: 'image/png',
            density: '1.0'
          },
          {
            src: 'icons/icon_x72.png',
            sizes: '72x72',
            type: 'image/png',
            density: '1.5'
          },
          {
            src: 'icons/icon_x96.png',
            sizes: '96x96',
            type: 'image/png',
            density: '2.0'
          },
          {
            src: 'icons/icon_x144.png',
            sizes: '144x144',
            type: 'image/png',
            density: '3.0'
          },
          {
            src: 'icons/icon_x192.png',
            sizes: '192x192',
            type: 'image/png',
            density: '4.0'
          },
          {
            src: 'icons/maskable_icon_x48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'maskable'
          }, {
            src: 'icons/maskable_icon_x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'maskable'
          }, {
            src: 'icons/maskable_icon_x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'maskable'
          }, {
            src: 'icons/maskable_icon_x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'maskable'
          }, {
            src: 'icons/maskable_icon_x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'maskable'
          }, {
            src: 'icons/maskable_icon_x168.png',
            sizes: '168x168',
            type: 'image/png',
            purpose: 'maskable'
          }, {
            src: 'icons/maskable_icon_x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }, {
            src: 'icons/maskable_icon_x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'maskable'
          }, {
            src: 'icons/maskable_icon_x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
}
