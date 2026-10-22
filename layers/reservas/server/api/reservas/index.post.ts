import { defineEventHandler } from 'h3'
import { leerCuerpo, leerSesion } from '#compartido/server/utils/comando'
import { Reserva } from '#reservas/shared/dominio/reserva'
import type { Franja } from '#reservas/shared/dominio/recurso-reservable'
import { reservar } from '#reservas/server/utils/reservas'

interface PedidoRecibido {
  recursoId: string
  titular: string
  franja: Franja
}

export default defineEventHandler(async (event) => {
  const { recursoId, titular, franja } = await leerCuerpo<PedidoRecibido>(event)
  return reservar(recursoId, Reserva.titularPara(leerSesion(event), titular ?? ''), franja)
})
