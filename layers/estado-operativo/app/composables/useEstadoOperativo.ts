import { useComando } from '#compartido/app/composables/useComando'
import { rutaDeComando } from '#estado-operativo/app/services/estado-operativo.service'
import { useEstadoOperativoStore } from '#estado-operativo/app/stores/estado-operativo.store'

function useEstadoOperativo() {
  const store = useEstadoOperativoStore()
  const { ejecutarYRecargar, estaEnviando } = useComando()

  function registrarIncidente(id: string, descripcion: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.registrarIncidente(id), store.cargar, { descripcion })
  }

  function bloquear(id: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.bloquear(id), store.cargar)
  }

  function rehabilitar(id: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.rehabilitar(id), store.cargar)
  }

  function marcarOcupado(id: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.marcarOcupado(id), store.cargar)
  }

  function liberar(id: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.liberar(id), store.cargar)
  }

  return { registrarIncidente, bloquear, rehabilitar, marcarOcupado, liberar, estaEnviando }
}

export { useEstadoOperativo }
