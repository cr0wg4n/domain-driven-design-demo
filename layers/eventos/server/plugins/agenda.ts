import { defineNitroPlugin } from 'nitropack/runtime'
import { Contexto } from '#compartido/shared/contexto'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { suscribir } from '#compartido/server/utils/bus-de-eventos'
import { alReiniciar, alSembrar } from '#compartido/server/utils/demo'
import { EventoInventario } from '#inventario-espacios/shared/dominio/eventos'
import type { AforoModificado, EspacioHabilitado } from '#inventario-espacios/shared/dominio/eventos'
import { TipoEspacio } from '#inventario-espacios/shared/dominio/tipo-espacio'
import { EventoOperativo } from '#estado-operativo/shared/dominio/eventos'
import type { CambioDeOcupacion } from '#estado-operativo/shared/dominio/eventos'
import { Bloque } from '#eventos/shared/dominio/solicitud-de-evento'
import { conocerSalon, esElSalon, leerSalon, solicitarEvento, vaciarAgenda } from '#eventos/server/utils/agenda'

function cuandoSeHabilita(evento: EventoDeDominio): void {
  const { espacioId, tipo, aforo } = evento.datos as EspacioHabilitado
  if (tipo === TipoEspacio.SALON_EVENTOS) conocerSalon({ espacioId, aforo, sePuedeUsar: true })
}

function cuandoCambiaElAforo(evento: EventoDeDominio): void {
  const { espacioId, aforoNuevo } = evento.datos as AforoModificado
  const salon = leerSalon()
  if (salon && esElSalon(espacioId)) salon.aforo = aforoNuevo
}

function cuandoCambiaElUsoDelSalon(sePuedeUsar: boolean) {
  return (evento: EventoDeDominio): void => {
    const salon = leerSalon()
    if (salon && esElSalon((evento.datos as CambioDeOcupacion).espacioId)) salon.sePuedeUsar = sePuedeUsar
  }
}

function sembrarAgenda(): void {
  solicitarEvento({ organizador: 'Estudio Norte', asistentes: 60, bloque: Bloque.MEDIO_DIA })
  solicitarEvento({ organizador: 'Empresa Andina', asistentes: 95, bloque: Bloque.DIA_COMPLETO })
}

export default defineNitroPlugin(() => {
  suscribir(Contexto.EVENTOS, EventoInventario.ESPACIO_HABILITADO, cuandoSeHabilita)
  suscribir(Contexto.EVENTOS, EventoInventario.AFORO_MODIFICADO, cuandoCambiaElAforo)
  suscribir(Contexto.EVENTOS, EventoOperativo.ESPACIO_BLOQUEADO, cuandoCambiaElUsoDelSalon(false))
  suscribir(Contexto.EVENTOS, EventoOperativo.ESPACIO_REHABILITADO, cuandoCambiaElUsoDelSalon(true))
  alReiniciar(vaciarAgenda)
  alSembrar(3, sembrarAgenda)
})
