import { defineEventHandler } from 'h3'
import { leerSalon, listarSolicitudes } from '#eventos/server/utils/agenda'

export default defineEventHandler(() => ({
  salon: leerSalon(),
  solicitudes: listarSolicitudes().map(solicitud => solicitud.aDatos())
}))
