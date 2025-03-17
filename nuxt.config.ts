import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Webnote',
      htmlAttrs: {
        lang: 'de-DE'
      }
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/fonts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vite-pwa/nuxt'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Webnote',
      short_name: 'Webnote',
      description: 'A web app for taking notes as either text or checklists',
      theme_color: '#009688',
      background_color: '#121212',
      display: 'standalone',
      icons: [
        {
          src: '/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      periodicSyncForUpdates: 120
    },
    devOptions: {
      navigateFallback: '/'
    }
  },
  runtimeConfig: {
    public: {
      offlineMode: false,
      apiPort: 3009
    }
  }
})
