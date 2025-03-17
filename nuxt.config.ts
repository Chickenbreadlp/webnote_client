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
  runtimeConfig: {
    public: {
      offlineMode: false,
      apiPort: 3009,
      apiHost: ''
    }
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  ssr: false,
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/fonts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  }
})
