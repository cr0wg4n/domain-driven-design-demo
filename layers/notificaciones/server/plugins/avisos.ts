import { defineNitroPlugin } from 'nitropack/runtime'
import { Contexto } from '#compartido/shared/contexto'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { Rol } from '#compartido/shared/rol'
import { suscribir } from '#compartido/server/utils/bus-de-eventos'
import { alReiniciar } from '#compartido/server/utils/demo'
import { EventoOperativo } from '#estado-operativo/shared/dominio/eventos'
import type { CambioDeOcupacion, EspacioBloqueado, IncidenteRegistrado } from '#estado-operativo/shared/dominio/eventos'
import { EventoReservas } from '#reservas/shared/dominio/eventos'
import { QUIENES_REASIGNAN } from '#reservas/shared/dominio/reserva'
import type { ReservaCancelada, ReservaConfirmada, ReservaPorReasignar, ReservaReasignada } from '#reservas/shared/dominio/eventos'
import { EventoAgenda } from '#eventos/shared/dominio/eventos'
import type { EventoAprobado, EventoSolicitado } from '#eventos/shared/dominio/eventos'
import { Canal } from '#notificaciones/shared/aviso'
import type { Destinatario } from '#notificaciones/shared/aviso'
import { enviarAviso, vaciarAvisos } from '#notificaciones/server/utils/avisos'

interface Borrador {
  para: Destinatario
  mensaje: string
  canal: Canal
}

type Redaccion = (evento: EventoDeDominio) => Borrador[]

function aRoles(roles: Rol[], mensaje: string): Borrador[] {
  return roles.map(rol => ({ para: { rol }, mensaje, canal: Canal.MENSAJERIA }))
}

const REDACCIONES: Record<string, Redaccion> = {
  [EventoReservas.RESERVA_CONFIRMADA]: ({ datos }) => {
    const { titular, recurso } = datos as ReservaConfirmada
    return [{ para: { persona: titular }, mensaje: `Tu reserva en ${recurso} está confirmada`, canal: Canal.CORREO }]
  },
  [EventoReservas.RESERVA_CANCELADA]: ({ datos }) => {
    const { titular, recurso } = datos as ReservaCancelada
    return [{ para: { persona: titular }, mensaje: `Tu reserva en ${recurso} fue cancelada`, canal: Canal.CORREO }]
  },
  [EventoReservas.RESERVA_POR_REASIGNAR]: ({ datos }) => {
    const { titular, recurso, motivo } = datos as ReservaPorReasignar
    return [
      { para: { persona: titular }, mensaje: `${recurso} quedó fuera de uso (${motivo}). Te asignaremos un espacio equivalente`, canal: Canal.MENSAJERIA },
      ...aRoles(QUIENES_REASIGNAN, `La reserva de ${titular} en ${recurso} está por reasignar`)
    ]
  },
  [EventoReservas.RESERVA_REASIGNADA]: ({ datos }) => {
    const { titular, recursoNuevo } = datos as ReservaReasignada
    return [{ para: { persona: titular }, mensaje: `Tu reserva ahora es en ${recursoNuevo}`, canal: Canal.MENSAJERIA }]
  },
  [EventoOperativo.INCIDENTE_REGISTRADO]: ({ datos }) => {
    const { nombre, descripcion } = datos as IncidenteRegistrado
    return aRoles([Rol.DIRECCION], `Incidente en ${nombre}: ${descripcion}`)
  },
  [EventoOperativo.ESPACIO_BLOQUEADO]: ({ datos }) => {
    const { nombre, motivo } = datos as EspacioBloqueado
    return aRoles([Rol.DIRECCION, Rol.RECEPCION], `${nombre} está en mantenimiento: ${motivo}`)
  },
  [EventoOperativo.ESPACIO_LIBERADO]: ({ datos }) => {
    const { nombre } = datos as CambioDeOcupacion
    return aRoles([Rol.RECEPCION], `Se liberó ${nombre}: avisar a la lista de espera`)
  },
  [EventoAgenda.EVENTO_SOLICITADO]: ({ datos }) => {
    const { organizador, asistentes, requiereAprobacion } = datos as EventoSolicitado
    return requiereAprobacion
      ? aRoles([Rol.DIRECCION], `${organizador} pide el salón para ${asistentes} personas: requiere aprobación`)
      : []
  },
  [EventoAgenda.EVENTO_APROBADO]: ({ datos }) => {
    const { organizador } = datos as EventoAprobado
    return aRoles([Rol.RECEPCION], `Evento de ${organizador} aprobado`)
  }
}

export default defineNitroPlugin(() => {
  Object.entries(REDACCIONES).forEach(([nombreEvento, redactar]) => {
    suscribir(Contexto.NOTIFICACIONES, nombreEvento, (evento) => {
      redactar(evento).forEach(borrador => enviarAviso({ ...borrador, porEvento: evento.nombre }))
    })
  })
  alReiniciar(vaciarAvisos)
})
