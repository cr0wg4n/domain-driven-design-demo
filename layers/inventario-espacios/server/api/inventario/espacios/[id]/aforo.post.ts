import { defineEventHandler } from 'h3'
import { leerCuerpo, leerId, leerRol } from '#compartido/server/utils/comando'
import { inventarioService } from '#inventario-espacios/server/services/inventario.service'

interface CambioDeAforo {
  aforo: number
}

export default defineEventHandler(async (event) => {
  const { aforo } = await leerCuerpo<CambioDeAforo>(event)
  return inventarioService.cambiarAforo(leerId(event), Number(aforo), leerRol(event))
})
