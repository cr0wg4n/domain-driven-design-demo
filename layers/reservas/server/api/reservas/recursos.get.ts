import { defineEventHandler } from 'h3'
import { listarRecursos } from '#reservas/server/utils/reservas'

export default defineEventHandler(() => listarRecursos())
