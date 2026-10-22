import { defineEventHandler } from 'h3'
import { leerSesion } from '#compartido/server/utils/comando'
import { paraElCalendario } from '#reservas/shared/dominio/reserva-en-calendario'
import { listarReservas } from '#reservas/server/utils/reservas'

export default defineEventHandler((event) => {
  const sesion = leerSesion(event)
  return listarReservas().map(reserva => paraElCalendario(reserva.aDatos(), sesion))
})
