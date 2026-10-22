import { useComando } from '#compartido/app/composables/useComando'
import { rutaDeComando } from '#reservas/app/services/reservas.service'
import type { PedidoDeReservaEnviado } from '#reservas/app/services/reservas.service'
import { useReservasStore } from '#reservas/app/stores/reservas.store'

function useReservas() {
  const store = useReservasStore()
  const { ejecutarYRecargar, estaEnviando } = useComando()

  function reservar(pedido: PedidoDeReservaEnviado): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.reservar(), store.cargar, pedido)
  }

  function cancelar(id: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.cancelar(id), store.cargar)
  }

  function reasignar(id: string, recursoId: string): Promise<boolean> {
    return ejecutarYRecargar(rutaDeComando.reasignar(id), store.cargar, { recursoId })
  }

  return { reservar, cancelar, reasignar, estaEnviando }
}

export { useReservas }
