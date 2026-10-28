import { defineEventHandler } from 'h3'
import { leerId, leerRol } from '#compartido/server/utils/comando'
import { inventarioService } from '#inventario-espacios/server/services/inventario.service'

export default defineEventHandler(event => inventarioService.darDeBaja(leerId(event), leerRol(event)))
