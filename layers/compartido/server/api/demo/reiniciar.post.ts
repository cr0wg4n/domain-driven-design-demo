import { defineEventHandler } from 'h3'
import { reiniciarDemo } from '#compartido/server/utils/demo'
import { leerZona } from '#compartido/server/utils/zona-horaria'

export default defineEventHandler((event) => {
  reiniciarDemo(leerZona(event))
  return { reiniciada: true }
})
