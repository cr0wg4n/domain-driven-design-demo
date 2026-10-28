import { Rol } from '#compartido/shared/rol'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import type { Resultado } from '#compartido/shared/resultado'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, noEncontrado } from '#compartido/server/utils/comando'
import { Espacio } from '#inventario-espacios/shared/dominio/espacio'
import type { DatosDeEspacio, SolicitudDeRegistro } from '#inventario-espacios/shared/dominio/espacio'
import type { EspacioRepository } from '#inventario-espacios/shared/dominio/espacio-repository'
import type { AforoModificado, EspacioDadoDeBaja, EspacioHabilitado, EspacioRegistrado } from '#inventario-espacios/shared/dominio/eventos'
import { TipoEspacio } from '#inventario-espacios/shared/dominio/tipo-espacio'
import { EspacioRepositoryEnMemoria } from '#inventario-espacios/server/repositories/espacio.repository.en-memoria'

function serie(cantidad: number, nombre: string, tipo: TipoEspacio, aforo: number): SolicitudDeRegistro[] {
  return Array.from({ length: cantidad }, (_, i) => ({ nombre: `${nombre} ${i + 1}`, tipo, aforo }))
}

const INVENTARIO_INICIAL: SolicitudDeRegistro[] = [
  { nombre: 'Salón de eventos', tipo: TipoEspacio.SALON_EVENTOS, aforo: 80 },
  { nombre: 'Sala de capacitación', tipo: TipoEspacio.SALA_CAPACITACION, aforo: 40 },
  { nombre: 'Sala de reunión A', tipo: TipoEspacio.SALA_REUNION, aforo: 8 },
  { nombre: 'Sala de reunión B', tipo: TipoEspacio.SALA_REUNION, aforo: 16 },
  ...serie(2, 'Oficina privada', TipoEspacio.OFICINA_PRIVADA, 4),
  { nombre: 'Sala común', tipo: TipoEspacio.SALA_COMUN, aforo: 20 },
  ...serie(6, 'Escritorio fijo', TipoEspacio.ESCRITORIO_FIJO, 1),
  ...serie(8, 'Escritorio flexible', TipoEspacio.ESCRITORIO_FLEXIBLE, 1)
]

const PENDIENTE_DE_HABILITAR: SolicitudDeRegistro = { nombre: 'Oficina privada 3', tipo: TipoEspacio.OFICINA_PRIVADA, aforo: 4 }

class InventarioService {
  constructor(private readonly espacios: EspacioRepository) {}

  registrar(solicitud: SolicitudDeRegistro, quien: Rol): { id: string, evento: EventoDeDominio<EspacioRegistrado> } {
    const { espacio, evento } = exigir(Espacio.registrar(solicitud, quien))
    this.espacios.guardar(espacio)
    publicar(evento)
    return { id: espacio.id, evento }
  }

  habilitar(id: string, quien: Rol): EventoDeDominio<EspacioHabilitado> {
    return this.ejecutar(id, espacio => espacio.habilitar(quien))
  }

  cambiarAforo(id: string, aforoNuevo: number, quien: Rol): EventoDeDominio<AforoModificado> {
    return this.ejecutar(id, espacio => espacio.cambiarAforo(aforoNuevo, quien))
  }

  darDeBaja(id: string, quien: Rol): EventoDeDominio<EspacioDadoDeBaja> {
    return this.ejecutar(id, espacio => espacio.darDeBaja(quien))
  }

  listar(): DatosDeEspacio[] {
    return this.espacios.listar().map(espacio => espacio.aDatos())
  }

  sembrar(): void {
    INVENTARIO_INICIAL.forEach((solicitud) => {
      const { id } = this.registrar(solicitud, Rol.DIRECCION)
      this.habilitar(id, Rol.DIRECCION)
    })
    this.registrar(PENDIENTE_DE_HABILITAR, Rol.DIRECCION)
  }

  reiniciar(): void {
    this.espacios.vaciar()
  }

  private ejecutar<D>(id: string, comando: (espacio: Espacio) => Resultado<EventoDeDominio<D>>): EventoDeDominio<D> {
    const espacio = this.espacios.buscarPorId(id) ?? noEncontrado('El espacio')
    const evento = exigir(comando(espacio))
    this.espacios.guardar(espacio)
    publicar(evento)
    return evento
  }
}

const inventarioService = new InventarioService(new EspacioRepositoryEnMemoria())

export { InventarioService, inventarioService }
