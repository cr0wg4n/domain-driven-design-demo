import { Contexto } from '#compartido/shared/contexto'
import { crearEvento } from '#compartido/shared/evento-de-dominio'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { exito, rechazo } from '#compartido/shared/resultado'
import type { Resultado } from '#compartido/shared/resultado'
import { Rol } from '#compartido/shared/rol'
import { EventoOperativo } from './eventos'
import type { CambioDeOcupacion, EspacioBloqueado, IncidenteRegistrado } from './eventos'

enum EstadoOperativo {
  LIBRE_AHORA = 'LIBRE_AHORA',
  OCUPADO = 'OCUPADO',
  EN_MANTENIMIENTO = 'EN_MANTENIMIENTO'
}

interface Incidente {
  readonly descripcion: string
  readonly registradoPor: Rol
  readonly registradoEn: string
}

interface DatosDeEspacioOperativo {
  readonly espacioId: string
  readonly nombre: string
  readonly estado: EstadoOperativo
  readonly incidente: Incidente | null
}

const QUIENES_BLOQUEAN = [Rol.DIRECCION, Rol.OPERACIONES]
const QUIENES_MARCAN_OCUPACION = [Rol.RECEPCION, Rol.OPERACIONES]
const QUIENES_REGISTRAN_INCIDENTES = [Rol.OPERACIONES]

function evento<D>(nombre: EventoOperativo, datos: D): EventoDeDominio<D> {
  return crearEvento(nombre, Contexto.ESTADO_OPERATIVO, datos)
}

class EspacioOperativo {
  private constructor(
    readonly espacioId: string,
    readonly nombre: string,
    private estado: EstadoOperativo,
    private incidente: Incidente | null
  ) {}

  static incorporar(espacioId: string, nombre: string): EspacioOperativo {
    return new EspacioOperativo(espacioId, nombre, EstadoOperativo.LIBRE_AHORA, null)
  }

  estaLibreAhora(): boolean {
    return this.estado === EstadoOperativo.LIBRE_AHORA
  }

  estaEnMantenimiento(): boolean {
    return this.estado === EstadoOperativo.EN_MANTENIMIENTO
  }

  registrarIncidente(descripcion: string, quien: Rol): Resultado<EventoDeDominio<IncidenteRegistrado>> {
    if (!QUIENES_REGISTRAN_INCIDENTES.includes(quien)) return rechazo('Solo Operaciones registra incidentes')
    if (!descripcion.trim()) return rechazo('Describe qué falla en el espacio')
    if (this.incidente) return rechazo('El espacio ya tiene un incidente abierto')

    this.incidente = { descripcion: descripcion.trim(), registradoPor: quien, registradoEn: new Date().toISOString() }
    return exito(evento(EventoOperativo.INCIDENTE_REGISTRADO, {
      espacioId: this.espacioId,
      nombre: this.nombre,
      descripcion: this.incidente.descripcion
    }))
  }

  bloquear(quien: Rol): Resultado<EventoDeDominio<EspacioBloqueado>> {
    if (!QUIENES_BLOQUEAN.includes(quien)) return rechazo('Solo Dirección u Operaciones bloquean un espacio')
    if (this.estaEnMantenimiento()) return rechazo('El espacio ya está en mantenimiento')

    this.estado = EstadoOperativo.EN_MANTENIMIENTO
    return exito(evento(EventoOperativo.ESPACIO_BLOQUEADO, {
      espacioId: this.espacioId,
      nombre: this.nombre,
      motivo: this.incidente?.descripcion ?? 'Mantenimiento'
    }))
  }

  rehabilitar(quien: Rol): Resultado<EventoDeDominio<CambioDeOcupacion>> {
    if (!QUIENES_BLOQUEAN.includes(quien)) return rechazo('Solo Dirección u Operaciones rehabilitan un espacio')
    if (!this.estaEnMantenimiento()) return rechazo('Solo se rehabilita un espacio en mantenimiento')

    this.estado = EstadoOperativo.LIBRE_AHORA
    this.incidente = null
    return exito(evento(EventoOperativo.ESPACIO_REHABILITADO, { espacioId: this.espacioId, nombre: this.nombre }))
  }

  marcarOcupado(quien: Rol): Resultado<EventoDeDominio<CambioDeOcupacion>> {
    if (!QUIENES_MARCAN_OCUPACION.includes(quien)) return rechazo('Solo Recepción u Operaciones marcan la ocupación')
    if (!this.estaLibreAhora()) return rechazo('El espacio no está libre ahora')

    this.estado = EstadoOperativo.OCUPADO
    return exito(evento(EventoOperativo.ESPACIO_OCUPADO, { espacioId: this.espacioId, nombre: this.nombre }))
  }

  liberar(quien: Rol): Resultado<EventoDeDominio<CambioDeOcupacion>> {
    if (!QUIENES_MARCAN_OCUPACION.includes(quien)) return rechazo('Solo Recepción u Operaciones liberan un espacio')
    if (this.estado !== EstadoOperativo.OCUPADO) return rechazo('Solo se libera un espacio ocupado')

    this.estado = EstadoOperativo.LIBRE_AHORA
    return exito(evento(EventoOperativo.ESPACIO_LIBERADO, { espacioId: this.espacioId, nombre: this.nombre }))
  }

  aDatos(): DatosDeEspacioOperativo {
    return { espacioId: this.espacioId, nombre: this.nombre, estado: this.estado, incidente: this.incidente }
  }
}

export { EspacioOperativo, EstadoOperativo, QUIENES_BLOQUEAN, QUIENES_MARCAN_OCUPACION, QUIENES_REGISTRAN_INCIDENTES }
export type { DatosDeEspacioOperativo, Incidente }
