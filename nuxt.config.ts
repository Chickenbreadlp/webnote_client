import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
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
    client: {
      periodicSyncForUpdates: 120
    }
  },
  runtimeConfig: {
    public: {
      offlineMode: false,
      apiPort: 3001
    }
  }
})
