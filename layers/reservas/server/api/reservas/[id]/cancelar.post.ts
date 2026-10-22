import { defineEventHandler } from 'h3'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, leerId, leerSesion } from '#compartido/server/utils/comando'
import { buscarReserva } from '#reservas/server/utils/reservas'

export default defineEventHandler((event) => {
  const evento = exigir(buscarReserva(leerId(event)).cancelar(leerSesion(event)))
  publicar(evento)
  return evento
})
