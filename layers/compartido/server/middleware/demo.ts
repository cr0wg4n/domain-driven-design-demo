import { defineEventHandler } from 'h3'
import { asegurarDemoIniciada } from '#compartido/server/utils/demo'
import { leerZona } from '#compartido/server/utils/zona-horaria'

export default defineEventHandler((event) => {
  asegurarDemoIniciada(leerZona(event))
})
