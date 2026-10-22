import { useComando } from '#compartido/app/composables/useComando'
import type { SolicitudDeRegistro } from '#inventario-espacios/shared/dominio/espacio'
import { rutaDeComando } from '#inventario-espacios/app/services/inventario.service'
import { useInventarioStore } from '#inventario-espacios/app/stores/inventario.store'

function useInventario() {
  const store = useInventarioStore()
  const { ejecutarYRecargar, estaEnviando } = useComando()

  function registrar(solicitud: SolicitudDeRegistro): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.registrar(), store.cargar, solicitud)
  }

  function habilitar(id: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.habilitar(id), store.cargar)
  }

  function cambiarAforo(id: string, aforo: number): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.cambiarAforo(id), store.cargar, { aforo })
  }

  function darDeBaja(id: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.darDeBaja(id), store.cargar)
  }

  return { registrar, habilitar, cambiarAforo, darDeBaja, estaEnviando }
}

export { useInventario }
