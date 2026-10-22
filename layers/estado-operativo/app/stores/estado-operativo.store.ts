import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { EstadoOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import type { DatosDeEspacioOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import { listarEspaciosOperativos } from '#estado-operativo/app/services/estado-operativo.service'

const useEstadoOperativoStore = defineStore('estado-operativo', () => {
  const espacios = ref<DatosDeEspacioOperativo[]>([])

  const cantidadPorEstado = computed(() =>
    Object.values(EstadoOperativo).map(estado => ({
      estado,
      cantidad: espacios.value.filter(espacio => espacio.estado === estado).length
    }))
  )

  async function cargar(): Promise<void> {
    espacios.value = await listarEspaciosOperativos()
  }

  return { espacios, cantidadPorEstado, cargar }
})

export { useEstadoOperativoStore }
