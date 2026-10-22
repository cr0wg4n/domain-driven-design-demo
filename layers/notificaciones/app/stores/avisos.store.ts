import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Aviso } from '#notificaciones/shared/aviso'
import { useSesionStore } from '#compartido/app/stores/sesion.store'
import { listarAvisos } from '#notificaciones/app/services/notificaciones.service'

const useAvisosStore = defineStore('avisos', () => {
  const avisos = ref<Aviso[]>([])
  const leidosHastaPorSesion = ref<Record<string, string>>({})

  const sesion = useSesionStore()

  const leidosHasta = computed(() => leidosHastaPorSesion.value[sesion.rol] ?? '')
  const cantidadNoLeidos = computed(() => avisos.value.filter(aviso => aviso.enviadoEn > leidosHasta.value).length)

  async function cargar(): Promise<void> {
    avisos.value = await listarAvisos()
  }

  function marcarComoLeidos(): void {
    const ultimo = avisos.value[0]?.enviadoEn
    if (ultimo) leidosHastaPorSesion.value = { ...leidosHastaPorSesion.value, [sesion.rol]: ultimo }
  }

  return { avisos, cantidadNoLeidos, cargar, marcarComoLeidos }
})

export { useAvisosStore }
