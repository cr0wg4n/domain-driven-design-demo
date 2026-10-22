import { defineNitroPlugin } from 'nitropack/runtime'
import { Contexto } from '#compartido/shared/contexto'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { suscribir } from '#compartido/server/utils/bus-de-eventos'
import { alReiniciar, alSembrar } from '#compartido/server/utils/demo'
import { EventoInventario } from '#inventario-espacios/shared/dominio/eventos'
import type { EspacioDadoDeBaja, EspacioHabilitado } from '#inventario-espacios/shared/dominio/eventos'
import { incorporarEspacio, retirarEspacio, sembrarOcupacion, vaciarEstadoOperativo } from '#estado-operativo/server/utils/estado-operativo'

function cuandoSeHabilita(evento: EventoDeDominio): void {
  const { espacioId, nombre } = evento.datos as EspacioHabilitado
  incorporarEspacio(espacioId, nombre)
}

function cuandoSeDaDeBaja(evento: EventoDeDominio): void {
  retirarEspacio((evento.datos as EspacioDadoDeBaja).espacioId)
}

export default defineNitroPlugin(() => {
  suscribir(Contexto.ESTADO_OPERATIVO, EventoInventario.ESPACIO_HABILITADO, cuandoSeHabilita)
  suscribir(Contexto.ESTADO_OPERATIVO, EventoInventario.ESPACIO_DADO_DE_BAJA, cuandoSeDaDeBaja)
  alReiniciar(vaciarEstadoOperativo)
  alSembrar(2, sembrarOcupacion)
})
