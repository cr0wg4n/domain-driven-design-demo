import { NOMBRE_DE_ROL, Rol } from './rol'

interface Sesion {
  readonly rol: Rol
  readonly nombre: string
}

const MIEMBRO_DE_PRUEBA = 'Ana Rojas'
const COOKIE_DE_SESION = 'nodo-rol'

function sesionDe(rol: Rol): Sesion {
  return { rol, nombre: rol === Rol.MIEMBRO ? MIEMBRO_DE_PRUEBA : NOMBRE_DE_ROL[rol] }
}

export { MIEMBRO_DE_PRUEBA, COOKIE_DE_SESION, sesionDe }
export type { Sesion }
