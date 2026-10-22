import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, noEncontrado } from '#compartido/server/utils/comando'
import { claveDeDia, instanteEnDia, sumarDias } from '#compartido/shared/zona-horaria'
import { Reserva } from '#reservas/shared/dominio/reserva'
import type { Franja, RecursoReservable } from '#reservas/shared/dominio/recurso-reservable'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import type { ReservaConfirmada } from '#reservas/shared/dominio/eventos'

const recursos = new Map<string, RecursoReservable>()
const reservas = new Map<string, Reserva>()

interface ReservaInicial {
  recurso: string
  titular: string
  dia: number
  desde: number
  hasta: number
}

const RESERVAS_INICIALES: ReservaInicial[] = [
  { recurso: 'Sala de reunión B', titular: 'Marta Salinas', dia: -1, desde: 10, hasta: 12 },
  { recurso: 'Sala de capacitación', titular: 'Academia Sur', dia: -1, desde: 14, hasta: 18 },
  { recurso: 'Sala de reunión A', titular: 'Ana Rojas', dia: 0, desde: 9, hasta: 10 },
  { recurso: 'Sala de reunión A', titular: 'Equipo Alfa', dia: 0, desde: 15, hasta: 16.5 },
  { recurso: 'Sala de reunión B', titular: 'Luis Peña', dia: 0, desde: 11, hasta: 12 },
  { recurso: 'Oficina privada 1', titular: 'Estudio Norte', dia: 0, desde: 8, hasta: 13 },
  { recurso: 'Sala de capacitación', titular: 'Taller de ventas', dia: 0, desde: 16, hasta: 19 },
  { recurso: 'Sala de reunión A', titular: 'Equipo Alfa', dia: 1, desde: 9.5, hasta: 11 },
  { recurso: 'Oficina privada 2', titular: 'Diego Ibáñez', dia: 1, desde: 13, hasta: 17 }
]

function horaDelDia(dia: number, hora: number, zona: string): string {
  const clave = sumarDias(claveDeDia(new Date(), zona), dia, zona)
  return instanteEnDia(clave, Math.floor(hora), (hora % 1) * 60, zona)
}

function agregarRecurso(recurso: RecursoReservable): void {
  recursos.set(recurso.recursoId, recurso)
}

function quitarRecurso(recursoId: string): void {
  recursos.delete(recursoId)
}

function buscarRecurso(recursoId: string): RecursoReservable {
  return recursos.get(recursoId) ?? noEncontrado('El recurso')
}

function listarRecursos(): RecursoReservable[] {
  return [...recursos.values()]
}

function buscarReserva(id: string): Reserva {
  return reservas.get(id) ?? noEncontrado('La reserva')
}

function listarReservas(): Reserva[] {
  return [...reservas.values()].sort((a, b) => a.franja.inicio.localeCompare(b.franja.inicio))
}

function reservasDe(recursoId: string): Reserva[] {
  return listarReservas().filter(reserva => reserva.recursoId === recursoId)
}

function reservar(recursoId: string, titular: string, franja: Franja): EventoDeDominio<ReservaConfirmada> {
  const recurso = buscarRecurso(recursoId)
  const { reserva, evento } = exigir(Reserva.reservar({ recurso, titular, franja }, reservasDe(recursoId)))
  reservas.set(reserva.id, reserva)
  publicar(evento)
  return evento
}

function marcarReservasPorReasignar(recursoId: string, motivo: string): void {
  reservasDe(recursoId)
    .filter(reserva => reserva.estaConfirmada())
    .forEach(reserva => publicar(exigir(reserva.marcarPorReasignar(motivo))))
}

function sembrarReservas(zona: string): void {
  RESERVAS_INICIALES.forEach(({ recurso, titular, dia, desde, hasta }) => {
    const encontrado = listarRecursos().find(r => r.nombre === recurso)
    if (encontrado) reservar(encontrado.recursoId, titular, { inicio: horaDelDia(dia, desde, zona), fin: horaDelDia(dia, hasta, zona) })
  })
}

function vaciarReservas(): void {
  recursos.clear()
  reservas.clear()
}

export {
  agregarRecurso,
  quitarRecurso,
  buscarRecurso,
  listarRecursos,
  buscarReserva,
  listarReservas,
  reservasDe,
  reservar,
  marcarReservasPorReasignar,
  sembrarReservas,
  vaciarReservas
}
