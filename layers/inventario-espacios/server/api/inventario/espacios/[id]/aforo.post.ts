import { defineEventHandler } from 'h3'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, leerCuerpo, leerId, leerRol } from '#compartido/server/utils/comando'
import { buscarEspacio } from '#inventario-espacios/server/utils/inventario'

interface CambioDeAforo {
  aforo: number
}

export default defineEventHandler(async (event) => {
  const espacio = buscarEspacio(leerId(event))
  const { aforo } = await leerCuerpo<CambioDeAforo>(event)
  const evento = exigir(espacio.cambiarAforo(Number(aforo), leerRol(event)))
  publicar(evento)
  return evento
})
