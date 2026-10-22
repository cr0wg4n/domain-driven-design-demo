import type { NavigationMenuItem } from '@nuxt/ui'
import { Rol } from '#compartido/shared/rol'

interface Seccion extends NavigationMenuItem {
  readonly to: string
  readonly roles: Rol[]
}

const PERSONAL = [Rol.DIRECCION, Rol.OPERACIONES, Rol.RECEPCION]

const SECCIONES: Seccion[] = [
  { label: 'Hoy', to: '/', icon: 'i-lucide-layout-dashboard', roles: PERSONAL },
  { label: 'Inventario', to: '/inventario', icon: 'i-lucide-armchair', roles: [Rol.DIRECCION] },
  { label: 'Estado operativo', to: '/estado-operativo', icon: 'i-lucide-activity', roles: PERSONAL },
  { label: 'Reservas', to: '/reservas', icon: 'i-lucide-calendar-clock', roles: Object.values(Rol) },
  { label: 'Eventos', to: '/eventos', icon: 'i-lucide-presentation', roles: [Rol.DIRECCION, Rol.RECEPCION] }
]

function seccionesPara(rol: Rol): Seccion[] {
  return SECCIONES.filter(seccion => seccion.roles.includes(rol))
}

function puedeVer(rol: Rol, ruta: string): boolean {
  const seccion = SECCIONES.find(s => s.to === ruta)
  return !seccion || seccion.roles.includes(rol)
}

function rutaDeInicio(rol: Rol): string {
  return seccionesPara(rol)[0]?.to ?? '/'
}

export { seccionesPara, puedeVer, rutaDeInicio }
export type { Seccion }
