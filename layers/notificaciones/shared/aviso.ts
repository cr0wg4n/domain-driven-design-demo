import { NOMBRE_DE_ROL } from '#compartido/shared/rol'
import type { Rol } from '#compartido/shared/rol'
import type { Sesion } from '#compartido/shared/sesion'

enum Canal {
  CORREO = 'CORREO',
  MENSAJERIA = 'MENSAJERIA'
}

type Destinatario = { readonly rol: Rol } | { readonly persona: string }

interface Aviso {
  readonly id: string
  readonly para: Destinatario
  readonly mensaje: string
  readonly canal: Canal
  readonly porEvento: string
  readonly enviadoEn: string
}

function esParaLaSesion(aviso: Aviso, sesion: Sesion): boolean {
  return 'rol' in aviso.para ? aviso.para.rol === sesion.rol : aviso.para.persona === sesion.nombre
}

function nombreDelDestinatario(destinatario: Destinatario): string {
  return 'rol' in destinatario ? NOMBRE_DE_ROL[destinatario.rol] : destinatario.persona
}

export { Canal, esParaLaSesion, nombreDelDestinatario }
export type { Aviso, Destinatario }
