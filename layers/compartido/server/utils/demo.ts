import { ZONA_POR_DEFECTO } from '#compartido/shared/zona-horaria'

interface Siembra {
  readonly orden: number
  readonly sembrar: (zona: string) => void
}

const limpiezas: Array<() => void> = []
const siembras: Siembra[] = []
let estaIniciada = false
let esProvisoria = false

function alReiniciar(limpiar: () => void): void {
  limpiezas.push(limpiar)
}

function alSembrar(orden: number, sembrar: (zona: string) => void): void {
  siembras.push({ orden, sembrar })
}

function reiniciarDemo(zona: string | null): void {
  limpiezas.forEach(limpiar => limpiar())
  ;[...siembras].sort((a, b) => a.orden - b.orden).forEach(s => s.sembrar(zona ?? ZONA_POR_DEFECTO))
  estaIniciada = true
  esProvisoria = zona === null
}

function asegurarDemoIniciada(zona: string | null): void {
  if (!estaIniciada || (esProvisoria && zona !== null)) reiniciarDemo(zona)
}

export { alReiniciar, alSembrar, reiniciarDemo, asegurarDemoIniciada }
