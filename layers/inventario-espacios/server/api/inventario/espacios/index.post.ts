import { defineEventHandler } from 'h3'
import { leerCuerpo, leerRol } from '#compartido/server/utils/comando'
import type { SolicitudDeRegistro } from '#inventario-espacios/shared/dominio/espacio'
import { registrarEspacio } from '#inventario-espacios/server/utils/inventario'

export default defineEventHandler(async (event) => {
  const solicitud = await leerCuerpo<SolicitudDeRegistro>(event)
  return registrarEspacio(solicitud, leerRol(event)).evento
})
