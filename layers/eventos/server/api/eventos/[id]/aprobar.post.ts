import { defineEventHandler } from 'h3'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, leerId, leerRol } from '#compartido/server/utils/comando'
import { buscarSolicitud } from '#eventos/server/utils/agenda'

export default defineEventHandler((event) => {
  const evento = exigir(buscarSolicitud(leerId(event)).aprobar(leerRol(event)))
  publicar(evento)
  return evento
})
