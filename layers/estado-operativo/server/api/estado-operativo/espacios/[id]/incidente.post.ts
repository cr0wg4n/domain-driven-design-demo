import { defineEventHandler } from 'h3'
import { leerCuerpo, leerId, leerRol } from '#compartido/server/utils/comando'
import { estadoOperativoService } from '#estado-operativo/server/services/estado-operativo.service'

interface ReporteDeIncidente {
  descripcion: string
}

export default defineEventHandler(async (event) => {
  const { descripcion } = await leerCuerpo<ReporteDeIncidente>(event)
  return estadoOperativoService.registrarIncidente(leerId(event), descripcion ?? '', leerRol(event))
})
