import { defineEventHandler } from 'h3'
import { inventarioService } from '#inventario-espacios/server/services/inventario.service'

export default defineEventHandler(() => inventarioService.listar())
