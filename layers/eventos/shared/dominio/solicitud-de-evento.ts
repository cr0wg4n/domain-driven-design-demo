import { Contexto } from '#compartido/shared/contexto'
import { crearEvento } from '#compartido/shared/evento-de-dominio'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { exito, rechazo } from '#compartido/shared/resultado'
import type { Resultado } from '#compartido/shared/resultado'
import { Rol } from '#compartido/shared/rol'
import { EventoAgenda } from './eventos'
import type { EventoAprobado, EventoSolicitado } from './eventos'

enum Bloque {
  MEDIO_DIA = 'MEDIO_DIA',
  DIA_COMPLETO = 'DIA_COMPLETO'
}

enum EstadoDeSolicitud {
  PENDIENTE_DE_APROBACION = 'PENDIENTE_DE_APROBACION',
  CONFIRMADA = 'CONFIRMADA'
}

interface Salon {
  readonly espacioId: string
  aforo: number
  sePuedeUsar: boolean
}

interface DatosDeSolicitud {
  readonly id: string
  readonly organizador: string
  readonly asistentes: number
  readonly bloque: Bloque
  readonly estado: EstadoDeSolicitud
}

interface PedidoDeEvento {
  organizador: string
  asistentes: number
  bloque: Bloque
}

const QUIENES_APRUEBAN = [Rol.DIRECCION]

function evento<D>(nombre: EventoAgenda, datos: D): EventoDeDominio<D> {
  return crearEvento(nombre, Contexto.EVENTOS, datos)
}

class SolicitudDeEvento {
  private constructor(
    readonly id: string,
    readonly organizador: string,
    readonly asistentes: number,
    readonly bloque: Bloque,
    private estado: EstadoDeSolicitud
  ) {}

  static solicitar(pedido: PedidoDeEvento, salon: Salon | null): Resultado<{ solicitud: SolicitudDeEvento, evento: EventoDeDominio<EventoSolicitado> }> {
    if (!salon?.sePuedeUsar) return rechazo('El salón no está disponible para eventos')
    if (!pedido.organizador.trim()) return rechazo('El evento necesita un organizador')
    if (pedido.asistentes < 1) return rechazo('Indica cuántas personas asistirán')

    const requiereAprobacion = pedido.asistentes > salon.aforo
    const estado = requiereAprobacion ? EstadoDeSolicitud.PENDIENTE_DE_APROBACION : EstadoDeSolicitud.CONFIRMADA
    const solicitud = new SolicitudDeEvento(crypto.randomUUID(), pedido.organizador.trim(), pedido.asistentes, pedido.bloque, estado)
    return exito({
      solicitud,
      evento: evento(EventoAgenda.EVENTO_SOLICITADO, {
        solicitudId: solicitud.id,
        organizador: solicitud.organizador,
        asistentes: solicitud.asistentes,
        requiereAprobacion
      })
    })
  }

  aprobar(quien: Rol): Resultado<EventoDeDominio<EventoAprobado>> {
    if (!QUIENES_APRUEBAN.includes(quien)) return rechazo('Solo Dirección aprueba eventos grandes')
    if (this.estado !== EstadoDeSolicitud.PENDIENTE_DE_APROBACION) return rechazo('Esta solicitud no espera aprobación')

    this.estado = EstadoDeSolicitud.CONFIRMADA
    return exito(evento(EventoAgenda.EVENTO_APROBADO, { solicitudId: this.id, organizador: this.organizador }))
  }

  aDatos(): DatosDeSolicitud {
    return {
      id: this.id,
      organizador: this.organizador,
      asistentes: this.asistentes,
      bloque: this.bloque,
      estado: this.estado
    }
  }
}

export { SolicitudDeEvento, Bloque, EstadoDeSolicitud, QUIENES_APRUEBAN }
export type { Salon, DatosDeSolicitud, PedidoDeEvento }
