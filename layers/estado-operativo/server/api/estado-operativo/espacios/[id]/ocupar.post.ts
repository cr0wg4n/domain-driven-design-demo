import { defineEventHandler } from 'h3'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, leerId, leerRol } from '#compartido/server/utils/comando'
import { buscarEspacioOperativo } from '#estado-operativo/server/utils/estado-operativo'

export default defineEventHandler((event) => {
  const espacio = buscarEspacioOperativo(leerId(event))
  const evento = exigir(espacio.marcarOcupado(leerRol(event)))
  publicar(evento)
  return evento
})
