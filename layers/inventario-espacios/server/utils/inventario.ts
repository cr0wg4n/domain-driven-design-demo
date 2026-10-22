import { Rol } from '#compartido/shared/rol'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { noEncontrado, exigir } from '#compartido/server/utils/comando'
import { Espacio } from '#inventario-espacios/shared/dominio/espacio'
import type { SolicitudDeRegistro } from '#inventario-espacios/shared/dominio/espacio'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import type { EspacioRegistrado } from '#inventario-espacios/shared/dominio/eventos'
import { TipoEspacio } from '#inventario-espacios/shared/dominio/tipo-espacio'

const espacios = new Map<string, Espacio>()

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

function registrarEspacio(solicitud: SolicitudDeRegistro, quien: Rol): { espacio: Espacio, evento: EventoDeDominio<EspacioRegistrado> } {
  const registro = exigir(Espacio.registrar(solicitud, quien))
  espacios.set(registro.espacio.id, registro.espacio)
  publicar(registro.evento)
  return registro
}

function sembrarInventario(): void {
  INVENTARIO_INICIAL.forEach((solicitud) => {
    const { espacio } = registrarEspacio(solicitud, Rol.DIRECCION)
    publicar(exigir(espacio.habilitar(Rol.DIRECCION)))
  })
  registrarEspacio(PENDIENTE_DE_HABILITAR, Rol.DIRECCION)
}

function vaciarInventario(): void {
  espacios.clear()
}

function buscarEspacio(id: string): Espacio {
  return espacios.get(id) ?? noEncontrado('El espacio')
}

function listarEspacios(): Espacio[] {
  return [...espacios.values()]
}

export { registrarEspacio, sembrarInventario, vaciarInventario, buscarEspacio, listarEspacios }
