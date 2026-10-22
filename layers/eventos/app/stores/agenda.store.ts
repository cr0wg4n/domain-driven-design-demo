import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DatosDeSolicitud, Salon } from '#eventos/shared/dominio/solicitud-de-evento'
import { leerAgenda } from '#eventos/app/services/agenda.service'

const useAgendaStore = defineStore('agenda', () => {
  const salon = ref<Salon | null>(null)
  const solicitudes = ref<DatosDeSolicitud[]>([])

  async function cargar(): Promise<void> {
    const agenda = await leerAgenda()
    salon.value = agenda.salon
    solicitudes.value = agenda.solicitudes
  }

  return { salon, solicitudes, cargar }
})

export { useAgendaStore }
