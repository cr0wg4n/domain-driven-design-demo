import { defineEventHandler } from 'h3'
import { listarEspacios } from '#inventario-espacios/server/utils/inventario'

export default defineEventHandler(() => listarEspacios().map(espacio => espacio.aDatos()))
