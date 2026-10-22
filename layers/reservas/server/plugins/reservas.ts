import { defineNitroPlugin } from 'nitropack/runtime'
import { Contexto } from '#compartido/shared/contexto'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { suscribir } from '#compartido/server/utils/bus-de-eventos'
import { alReiniciar, alSembrar } from '#compartido/server/utils/demo'
import { EventoInventario } from '#inventario-espacios/shared/dominio/eventos'
import type { AforoModificado, EspacioDadoDeBaja, EspacioHabilitado } from '#inventario-espacios/shared/dominio/eventos'
import { EventoOperativo } from '#estado-operativo/shared/dominio/eventos'
import type { CambioDeOcupacion, EspacioBloqueado } from '#estado-operativo/shared/dominio/eventos'
import {
  agregarRecurso,
  listarRecursos,
  marcarReservasPorReasignar,
  quitarRecurso,
  sembrarReservas,
  vaciarReservas
} from '#reservas/server/utils/reservas'

function cuandoSeHabilita(evento: EventoDeDominio): void {
  const { espacioId, nombre, aforo, bufferEnMinutos } = evento.datos as EspacioHabilitado
  agregarRecurso({ recursoId: espacioId, nombre, aforo, bufferEnMinutos, sePuedeReservar: true })
}

function cuandoCambiaElAforo(evento: EventoDeDominio): void {
  const { espacioId, aforoNuevo } = evento.datos as AforoModificado
  const recurso = listarRecursos().find(r => r.recursoId === espacioId)
  if (recurso) recurso.aforo = aforoNuevo
}

function cuandoSeDaDeBaja(evento: EventoDeDominio): void {
  const { espacioId, nombre } = evento.datos as EspacioDadoDeBaja
  marcarReservasPorReasignar(espacioId, `${nombre} fue dado de baja`)
  quitarRecurso(espacioId)
}

function cuandoSeBloquea(evento: EventoDeDominio): void {
  const { espacioId, motivo } = evento.datos as EspacioBloqueado
  const recurso = listarRecursos().find(r => r.recursoId === espacioId)
  if (!recurso) return
  recurso.sePuedeReservar = false
  marcarReservasPorReasignar(espacioId, motivo)
}

function cuandoSeRehabilita(evento: EventoDeDominio): void {
  const { espacioId } = evento.datos as CambioDeOcupacion
  const recurso = listarRecursos().find(r => r.recursoId === espacioId)
  if (recurso) recurso.sePuedeReservar = true
}

export default defineNitroPlugin(() => {
  suscribir(Contexto.RESERVAS, EventoInventario.ESPACIO_HABILITADO, cuandoSeHabilita)
  suscribir(Contexto.RESERVAS, EventoInventario.AFORO_MODIFICADO, cuandoCambiaElAforo)
  suscribir(Contexto.RESERVAS, EventoInventario.ESPACIO_DADO_DE_BAJA, cuandoSeDaDeBaja)
  suscribir(Contexto.RESERVAS, EventoOperativo.ESPACIO_BLOQUEADO, cuandoSeBloquea)
  suscribir(Contexto.RESERVAS, EventoOperativo.ESPACIO_REHABILITADO, cuandoSeRehabilita)
  alReiniciar(vaciarReservas)
  alSembrar(3, sembrarReservas)
})
