import { defineEventHandler } from 'h3'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, leerCuerpo, leerId, leerRol } from '#compartido/server/utils/comando'
import { buscarEspacioOperativo } from '#estado-operativo/server/utils/estado-operativo'

interface ReporteDeIncidente {
  descripcion: string
}

export default defineEventHandler(async (event) => {
  const espacio = buscarEspacioOperativo(leerId(event))
  const { descripcion } = await leerCuerpo<ReporteDeIncidente>(event)
  const evento = exigir(espacio.registrarIncidente(descripcion ?? '', leerRol(event)))
  publicar(evento)
  return evento
})
