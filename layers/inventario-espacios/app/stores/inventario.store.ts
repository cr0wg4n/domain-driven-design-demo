import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DatosDeEspacio } from '#inventario-espacios/shared/dominio/espacio'
import { listarEspacios } from '#inventario-espacios/app/services/inventario.service'

const useInventarioStore = defineStore('inventario', () => {
  const espacios = ref<DatosDeEspacio[]>([])

  async function cargar(): Promise<void> {
    espacios.value = await listarEspacios()
  }

  return { espacios, cargar }
})

export { useInventarioStore }
