import { defineStore } from 'pinia'
import { ref } from 'vue'
import { restablecerDatosDePrueba } from '#compartido/app/services/demo.service'

const useSincronizacionStore = defineStore('sincronizacion', () => {
  const version = ref(0)

  function notificarCambio(): void {
    version.value++
  }

  async function restablecerDatos(): Promise<void> {
    await restablecerDatosDePrueba()
    notificarCambio()
  }

  return { version, notificarCambio, restablecerDatos }
})

export { useSincronizacionStore }
