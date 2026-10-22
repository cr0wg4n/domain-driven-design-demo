import { Contexto } from '#compartido/shared/contexto'
import { crearEvento } from '#compartido/shared/evento-de-dominio'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import { exito, rechazo } from '#compartido/shared/resultado'
import type { Resultado } from '#compartido/shared/resultado'
import { Rol } from '#compartido/shared/rol'
import { BUFFER_EN_MINUTOS } from './tipo-espacio'
import type { TipoEspacio } from './tipo-espacio'
import { EventoInventario } from './eventos'
import type { AforoModificado, EspacioDadoDeBaja, EspacioHabilitado, EspacioRegistrado } from './eventos'

enum EstadoEnInventario {
  REGISTRADO = 'REGISTRADO',
  HABILITADO = 'HABILITADO',
  DADO_DE_BAJA = 'DADO_DE_BAJA'
}

interface DatosDeEspacio {
  readonly id: string
  readonly nombre: string
  readonly tipo: TipoEspacio
  readonly aforo: number
  readonly bufferEnMinutos: number
  readonly estado: EstadoEnInventario
}

interface SolicitudDeRegistro {
  nombre: string
  tipo: TipoEspacio
  aforo: number
}

const QUIENES_ADMINISTRAN_INVENTARIO = [Rol.DIRECCION]
const SOLO_DIRECCION = 'Solo Dirección puede hacerlo'

function evento<D>(nombre: EventoInventario, datos: D): EventoDeDominio<D> {
  return crearEvento(nombre, Contexto.INVENTARIO_ESPACIOS, datos)
}

class Espacio {
  private constructor(
    readonly id: string,
    readonly nombre: string,
    readonly tipo: TipoEspacio,
    private aforo: number,
    private estado: EstadoEnInventario
  ) {}

  static registrar(solicitud: SolicitudDeRegistro, quien: Rol): Resultado<{ espacio: Espacio, evento: EventoDeDominio<EspacioRegistrado> }> {
    if (!QUIENES_ADMINISTRAN_INVENTARIO.includes(quien)) return rechazo(SOLO_DIRECCION)
    if (!solicitud.nombre.trim()) return rechazo('El espacio necesita un nombre')
    if (solicitud.aforo < 1) return rechazo('El aforo debe ser de al menos una persona')

    const espacio = new Espacio(crypto.randomUUID(), solicitud.nombre.trim(), solicitud.tipo, solicitud.aforo, EstadoEnInventario.REGISTRADO)
    return exito({
      espacio,
      evento: evento(EventoInventario.ESPACIO_REGISTRADO, {
        espacioId: espacio.id,
        nombre: espacio.nombre,
        tipo: espacio.tipo,
        aforo: espacio.aforo
      })
    })
  }

  static desdeDatos(datos: DatosDeEspacio): Espacio {
    return new Espacio(datos.id, datos.nombre, datos.tipo, datos.aforo, datos.estado)
  }

  get bufferEnMinutos(): number {
    return BUFFER_EN_MINUTOS[this.tipo]
  }

  estaHabilitado(): boolean {
    return this.estado === EstadoEnInventario.HABILITADO
  }

  estaDadoDeBaja(): boolean {
    return this.estado === EstadoEnInventario.DADO_DE_BAJA
  }

  habilitar(quien: Rol): Resultado<EventoDeDominio<EspacioHabilitado>> {
    if (!QUIENES_ADMINISTRAN_INVENTARIO.includes(quien)) return rechazo(SOLO_DIRECCION)
    if (this.estado !== EstadoEnInventario.REGISTRADO) return rechazo('Solo se habilita un espacio recién registrado')

    this.estado = EstadoEnInventario.HABILITADO
    return exito(evento(EventoInventario.ESPACIO_HABILITADO, {
      espacioId: this.id,
      nombre: this.nombre,
      tipo: this.tipo,
      aforo: this.aforo,
      bufferEnMinutos: this.bufferEnMinutos
    }))
  }

  cambiarAforo(aforoNuevo: number, quien: Rol): Resultado<EventoDeDominio<AforoModificado>> {
    if (!QUIENES_ADMINISTRAN_INVENTARIO.includes(quien)) return rechazo(SOLO_DIRECCION)
    if (this.estaDadoDeBaja()) return rechazo('El espacio ya fue dado de baja')
    if (aforoNuevo < 1) return rechazo('El aforo debe ser de al menos una persona')
    if (aforoNuevo === this.aforo) return rechazo('El aforo nuevo es igual al actual')

    const aforoAnterior = this.aforo
    this.aforo = aforoNuevo
    return exito(evento(EventoInventario.AFORO_MODIFICADO, {
      espacioId: this.id,
      tipo: this.tipo,
      aforoAnterior,
      aforoNuevo
    }))
  }

  darDeBaja(quien: Rol): Resultado<EventoDeDominio<EspacioDadoDeBaja>> {
    if (!QUIENES_ADMINISTRAN_INVENTARIO.includes(quien)) return rechazo(SOLO_DIRECCION)
    if (this.estaDadoDeBaja()) return rechazo('El espacio ya fue dado de baja')

    this.estado = EstadoEnInventario.DADO_DE_BAJA
    return exito(evento(EventoInventario.ESPACIO_DADO_DE_BAJA, { espacioId: this.id, nombre: this.nombre }))
  }

  aDatos(): DatosDeEspacio {
    return {
      id: this.id,
      nombre: this.nombre,
      tipo: this.tipo,
      aforo: this.aforo,
      bufferEnMinutos: this.bufferEnMinutos,
      estado: this.estado
    }
  }
}

export { Espacio, EstadoEnInventario, QUIENES_ADMINISTRAN_INVENTARIO }
export type { DatosDeEspacio, SolicitudDeRegistro }
