import { defineEventHandler } from 'h3'
import { leerId, leerRol } from '#compartido/server/utils/comando'
import { estadoOperativoService } from '#estado-operativo/server/services/estado-operativo.service'

export default defineEventHandler(event => estadoOperativoService.marcarOcupado(leerId(event), leerRol(event)))
