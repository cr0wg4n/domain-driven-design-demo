const HORA_DE_APERTURA = 7
const HORA_DE_CIERRE = 21
const MINUTOS_DE_LA_JORNADA = (HORA_DE_CIERRE - HORA_DE_APERTURA) * 60

function dosDigitos(numero: number): string {
  return String(numero).padStart(2, '0')
}

function leerHora(hora: string): [number, number] {
  const [horas = 0, minutos = 0] = hora.split(':').map(Number)
  return [horas, minutos]
}

function minutosDesdeApertura(minutosDelDia: number): number {
  return minutosDelDia - HORA_DE_APERTURA * 60
}

function horaDesdeMinutos(minutosDesdeApertura: number): string {
  const total = HORA_DE_APERTURA * 60 + minutosDesdeApertura
  return `${dosDigitos(Math.floor(total / 60))}:${dosDigitos(total % 60)}`
}

function horasDeLaJornada(): number[] {
  return Array.from({ length: HORA_DE_CIERRE - HORA_DE_APERTURA }, (_, i) => HORA_DE_APERTURA + i)
}

export { MINUTOS_DE_LA_JORNADA, leerHora, minutosDesdeApertura, horaDesdeMinutos, horasDeLaJornada }
