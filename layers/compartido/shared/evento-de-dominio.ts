import type { Contexto } from './contexto'

interface EventoDeDominio<D = unknown> {
  readonly id: string
  readonly nombre: string
  readonly contexto: Contexto
  readonly ocurridoEn: string
  readonly datos: D
}

function crearEvento<D>(nombre: string, contexto: Contexto, datos: D): EventoDeDominio<D> {
  return {
    id: crypto.randomUUID(),
    nombre,
    contexto,
    ocurridoEn: new Date().toISOString(),
    datos
  }
}

export { crearEvento }
export type { EventoDeDominio }
