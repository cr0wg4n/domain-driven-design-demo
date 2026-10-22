import { fileURLToPath } from 'node:url'

function capa(nombre: string): string {
  return fileURLToPath(new URL(`./layers/${nombre}`, import.meta.url))
}

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  ui: { colorMode: false },
  imports: { autoImport: false },
  alias: {
    '#compartido': capa('compartido'),
    '#inventario-espacios': capa('inventario-espacios'),
    '#estado-operativo': capa('estado-operativo'),
    '#reservas': capa('reservas'),
    '#eventos': capa('eventos'),
    '#notificaciones': capa('notificaciones')
  },
  app: {
    head: {
      title: 'Nodo · Espacios y recursos',
      htmlAttrs: { lang: 'es' },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  vite: {
    optimizeDeps: { include: ['@date-fns/tz', 'date-fns', 'date-fns/locale'] }
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15'
})
