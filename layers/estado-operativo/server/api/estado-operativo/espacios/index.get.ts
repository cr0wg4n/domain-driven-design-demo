import { defineEventHandler } from 'h3'
import { estadoOperativoService } from '#estado-operativo/server/services/estado-operativo.service'

export default defineEventHandler(() => estadoOperativoService.listar())
