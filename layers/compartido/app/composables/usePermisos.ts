import type { Rol } from '#compartido/shared/rol'
import { useSesionStore } from '#compartido/app/stores/sesion.store'

function usePermisos() {
  const sesion = useSesionStore()

  function puede(quienes: Rol[]): boolean {
    return quienes.includes(sesion.rol)
  }

  return { puede }
}

export { usePermisos }
