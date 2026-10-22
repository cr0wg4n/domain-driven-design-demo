import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, noEncontrado } from '#compartido/server/utils/comando'
import { SolicitudDeEvento } from '#eventos/shared/dominio/solicitud-de-evento'
import type { PedidoDeEvento, Salon } from '#eventos/shared/dominio/solicitud-de-evento'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import type { EventoSolicitado } from '#eventos/shared/dominio/eventos'

let salon: Salon | null = null
const solicitudes = new Map<string, SolicitudDeEvento>()

function conocerSalon(nuevo: Salon): void {
  salon = nuevo
}

function leerSalon(): Salon | null {
  return salon
}

function esElSalon(espacioId: string): boolean {
  return salon?.espacioId === espacioId
}

function solicitarEvento(pedido: PedidoDeEvento): EventoDeDominio<EventoSolicitado> {
  const { solicitud, evento } = exigir(SolicitudDeEvento.solicitar(pedido, salon))
  solicitudes.set(solicitud.id, solicitud)
  publicar(evento)
  return evento
}

function buscarSolicitud(id: string): SolicitudDeEvento {
  return solicitudes.get(id) ?? noEncontrado('La solicitud')
}

function listarSolicitudes(): SolicitudDeEvento[] {
  return [...solicitudes.values()]
}

function vaciarAgenda(): void {
  salon = null
  solicitudes.clear()
}

export { conocerSalon, leerSalon, esElSalon, solicitarEvento, buscarSolicitud, listarSolicitudes, vaciarAgenda }
