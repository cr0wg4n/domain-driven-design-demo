import { defineEventHandler } from 'h3'
import { leerCuerpo, leerRol } from '#compartido/server/utils/comando'
import type { SolicitudDeRegistro } from '#inventario-espacios/shared/dominio/espacio'
import { inventarioService } from '#inventario-espacios/server/services/inventario.service'

export default defineEventHandler(async (event) => {
  const solicitud = await leerCuerpo<SolicitudDeRegistro>(event)
  return inventarioService.registrar(solicitud, leerRol(event)).evento
})
