import { defineNitroPlugin } from 'nitropack/runtime'
import { Contexto } from '#compartido/shared/contexto'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { suscribir } from '#compartido/server/utils/bus-de-eventos'
import { alReiniciar, alSembrar } from '#compartido/server/utils/demo'
import { EventoInventario } from '#inventario-espacios/shared/dominio/eventos'
import type { EspacioDadoDeBaja, EspacioHabilitado } from '#inventario-espacios/shared/dominio/eventos'
import { estadoOperativoService } from '#estado-operativo/server/services/estado-operativo.service'

function cuandoSeHabilita(evento: EventoDeDominio): void {
  const { espacioId, nombre } = evento.datos as EspacioHabilitado
  estadoOperativoService.incorporar(espacioId, nombre)
}

function cuandoSeDaDeBaja(evento: EventoDeDominio): void {
  estadoOperativoService.retirar((evento.datos as EspacioDadoDeBaja).espacioId)
}

export default defineNitroPlugin(() => {
  suscribir(Contexto.ESTADO_OPERATIVO, EventoInventario.ESPACIO_HABILITADO, cuandoSeHabilita)
  suscribir(Contexto.ESTADO_OPERATIVO, EventoInventario.ESPACIO_DADO_DE_BAJA, cuandoSeDaDeBaja)
  alReiniciar(() => estadoOperativoService.reiniciar())
  alSembrar(2, () => estadoOperativoService.sembrarOcupacion())
})
