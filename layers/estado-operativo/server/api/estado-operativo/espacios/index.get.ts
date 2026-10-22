import { defineEventHandler } from 'h3'
import { listarEspaciosOperativos } from '#estado-operativo/server/utils/estado-operativo'

export default defineEventHandler(() => listarEspaciosOperativos().map(espacio => espacio.aDatos()))
