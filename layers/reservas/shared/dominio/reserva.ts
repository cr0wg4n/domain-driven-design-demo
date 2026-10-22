import { Contexto } from '#compartido/shared/contexto'
import { crearEvento } from '#compartido/shared/evento-de-dominio'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { exito, rechazo } from '#compartido/shared/resultado'
import type { Resultado } from '#compartido/shared/resultado'
import { Rol } from '#compartido/shared/rol'
import type { Sesion } from '#compartido/shared/sesion'
import { esFranjaValida, seSolapanConBuffer } from './recurso-reservable'
import type { Franja, RecursoReservable } from './recurso-reservable'
import { EventoReservas } from './eventos'
import type { ReservaCancelada, ReservaConfirmada, ReservaPorReasignar, ReservaReasignada } from './eventos'

enum EstadoReserva {
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
  POR_REASIGNAR = 'POR_REASIGNAR'
}

interface DatosDeReserva {
  readonly id: string
  readonly recursoId: string
  readonly recurso: string
  readonly titular: string
  readonly franja: Franja
  readonly estado: EstadoReserva
}

interface PedidoDeReserva {
  recurso: RecursoReservable
  titular: string
  franja: Franja
}

const QUIENES_REASIGNAN = [Rol.DIRECCION, Rol.OPERACIONES]

function evento<D>(nombre: EventoReservas, datos: D): EventoDeDominio<D> {
  return crearEvento(nombre, Contexto.RESERVAS, datos)
}

function chocaConOtra(recurso: RecursoReservable, franja: Franja, otras: Reserva[]): boolean {
  return otras.some(otra => otra.estaConfirmada() && seSolapanConBuffer(franja, otra.franja, recurso.bufferEnMinutos))
}

class Reserva {
  private constructor(
    readonly id: string,
    private recurso: RecursoReservable,
    readonly titular: string,
    readonly franja: Franja,
    private estado: EstadoReserva
  ) {}

  static reservar(pedido: PedidoDeReserva, reservasDelRecurso: Reserva[]): Resultado<{ reserva: Reserva, evento: EventoDeDominio<ReservaConfirmada> }> {
    const { recurso, titular, franja } = pedido
    if (!recurso.sePuedeReservar) return rechazo(`${recurso.nombre} no se puede reservar ahora`)
    if (!titular.trim()) return rechazo('La reserva necesita un titular')
    if (!esFranjaValida(franja)) return rechazo('La franja debe terminar después de empezar')
    if (chocaConOtra(recurso, franja, reservasDelRecurso)) {
      return rechazo(`La franja se solapa con otra reserva (buffer de ${recurso.bufferEnMinutos} min)`)
    }

    const reserva = new Reserva(crypto.randomUUID(), recurso, titular.trim(), franja, EstadoReserva.CONFIRMADA)
    return exito({
      reserva,
      evento: evento(EventoReservas.RESERVA_CONFIRMADA, {
        reservaId: reserva.id,
        titular: reserva.titular,
        recurso: recurso.nombre,
        inicio: franja.inicio,
        fin: franja.fin
      })
    })
  }

  static titularPara(sesion: Sesion, titularPedido: string): string {
    return sesion.rol === Rol.MIEMBRO ? sesion.nombre : titularPedido
  }

  get recursoId(): string {
    return this.recurso.recursoId
  }

  estaConfirmada(): boolean {
    return this.estado === EstadoReserva.CONFIRMADA
  }

  cancelar(sesion: Sesion): Resultado<EventoDeDominio<ReservaCancelada>> {
    if (sesion.rol === Rol.MIEMBRO && this.titular !== sesion.nombre) return rechazo('Solo puedes cancelar tus propias reservas')
    if (this.estado === EstadoReserva.CANCELADA) return rechazo('La reserva ya estaba cancelada')

    this.estado = EstadoReserva.CANCELADA
    return exito(evento(EventoReservas.RESERVA_CANCELADA, {
      reservaId: this.id,
      titular: this.titular,
      recurso: this.recurso.nombre
    }))
  }

  marcarPorReasignar(motivo: string): Resultado<EventoDeDominio<ReservaPorReasignar>> {
    if (!this.estaConfirmada()) return rechazo('Solo se reasigna una reserva confirmada')

    this.estado = EstadoReserva.POR_REASIGNAR
    return exito(evento(EventoReservas.RESERVA_POR_REASIGNAR, {
      reservaId: this.id,
      titular: this.titular,
      recurso: this.recurso.nombre,
      motivo
    }))
  }

  reasignar(recursoNuevo: RecursoReservable, reservasDelNuevo: Reserva[], quien: Rol): Resultado<EventoDeDominio<ReservaReasignada>> {
    if (!QUIENES_REASIGNAN.includes(quien)) return rechazo('Solo Dirección u Operaciones reasignan reservas')
    if (this.estado !== EstadoReserva.POR_REASIGNAR) return rechazo('Esta reserva no está por reasignar')
    if (recursoNuevo.recursoId === this.recurso.recursoId) return rechazo('Elige un espacio distinto al bloqueado')
    if (!recursoNuevo.sePuedeReservar) return rechazo(`${recursoNuevo.nombre} no se puede reservar ahora`)
    if (recursoNuevo.aforo < this.recurso.aforo) return rechazo('El espacio nuevo no es equivalente: tiene menos aforo')
    if (chocaConOtra(recursoNuevo, this.franja, reservasDelNuevo)) return rechazo('El espacio nuevo ya está reservado en esa franja')

    const recursoAnterior = this.recurso.nombre
    this.recurso = recursoNuevo
    this.estado = EstadoReserva.CONFIRMADA
    return exito(evento(EventoReservas.RESERVA_REASIGNADA, {
      reservaId: this.id,
      titular: this.titular,
      recursoAnterior,
      recursoNuevo: recursoNuevo.nombre
    }))
  }

  aDatos(): DatosDeReserva {
    return {
      id: this.id,
      recursoId: this.recurso.recursoId,
      recurso: this.recurso.nombre,
      titular: this.titular,
      franja: this.franja,
      estado: this.estado
    }
  }
}

export { Reserva, EstadoReserva, QUIENES_REASIGNAN }
export type { DatosDeReserva, PedidoDeReserva }
