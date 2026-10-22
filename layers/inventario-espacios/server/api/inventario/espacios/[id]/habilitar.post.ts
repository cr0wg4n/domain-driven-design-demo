import { defineEventHandler } from 'h3'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, leerId, leerRol } from '#compartido/server/utils/comando'
import { buscarEspacio } from '#inventario-espacios/server/utils/inventario'

export default defineEventHandler((event) => {
  const espacio = buscarEspacio(leerId(event))
  const evento = exigir(espacio.habilitar(leerRol(event)))
  publicar(evento)
  return evento
})
