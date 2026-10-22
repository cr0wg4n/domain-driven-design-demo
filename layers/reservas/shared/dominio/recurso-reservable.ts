interface RecursoReservable {
  readonly recursoId: string
  readonly nombre: string
  aforo: number
  readonly bufferEnMinutos: number
  sePuedeReservar: boolean
}

interface Franja {
  readonly inicio: string
  readonly fin: string
}

const MINUTO_EN_MS = 60_000

function esFranjaValida(franja: Franja): boolean {
  return new Date(franja.fin).getTime() > new Date(franja.inicio).getTime()
}

function seSolapanConBuffer(a: Franja, b: Franja, bufferEnMinutos: number): boolean {
  const buffer = bufferEnMinutos * MINUTO_EN_MS
  const inicioA = new Date(a.inicio).getTime()
  const finA = new Date(a.fin).getTime() + buffer
  const inicioB = new Date(b.inicio).getTime()
  const finB = new Date(b.fin).getTime() + buffer
  return inicioA < finB && inicioB < finA
}

export { esFranjaValida, seSolapanConBuffer }
export type { RecursoReservable, Franja }
