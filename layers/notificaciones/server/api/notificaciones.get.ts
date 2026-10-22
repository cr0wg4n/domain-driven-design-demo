import { defineEventHandler } from 'h3'
import { leerSesion } from '#compartido/server/utils/comando'
import { avisosPara } from '#notificaciones/server/utils/avisos'

export default defineEventHandler(event => avisosPara(leerSesion(event)))
