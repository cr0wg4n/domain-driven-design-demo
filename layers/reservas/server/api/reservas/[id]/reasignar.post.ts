import { defineEventHandler } from 'h3'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, leerCuerpo, leerId, leerRol } from '#compartido/server/utils/comando'
import { buscarRecurso, buscarReserva, reservasDe } from '#reservas/server/utils/reservas'

interface PedidoDeReasignacion {
  recursoId: string
}

export default defineEventHandler(async (event) => {
  const reserva = buscarReserva(leerId(event))
  const { recursoId } = await leerCuerpo<PedidoDeReasignacion>(event)
  const recursoNuevo = buscarRecurso(recursoId)
  const evento = exigir(reserva.reasignar(recursoNuevo, reservasDe(recursoId), leerRol(event)))
  publicar(evento)
  return evento
})
