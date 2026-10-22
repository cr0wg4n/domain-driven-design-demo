import { useComando } from '#compartido/app/composables/useComando'
import type { PedidoDeEvento } from '#eventos/shared/dominio/solicitud-de-evento'
import { rutaDeComando } from '#eventos/app/services/agenda.service'
import { useAgendaStore } from '#eventos/app/stores/agenda.store'

function useAgenda() {
  const store = useAgendaStore()
  const { ejecutarYRecargar, estaEnviando } = useComando()

  function solicitar(pedido: PedidoDeEvento): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.solicitar(), store.cargar, pedido)
  }

  function aprobar(id: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.aprobar(id), store.cargar)
  }

  return { solicitar, aprobar, estaEnviando }
}

export { useAgenda }
