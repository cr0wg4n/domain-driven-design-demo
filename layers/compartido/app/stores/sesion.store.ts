import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCookie } from '#imports'
import { Rol } from '#compartido/shared/rol'
import { COOKIE_DE_SESION, sesionDe } from '#compartido/shared/sesion'

const useSesionStore = defineStore('sesion', () => {
  const rol = useCookie<Rol>(COOKIE_DE_SESION, { default: () => Rol.DIRECCION })

  const nombre = computed(() => sesionDe(rol.value).nombre)
  const esMiembro = computed(() => rol.value === Rol.MIEMBRO)

  function actuarComo(nuevoRol: Rol): void {
    rol.value = nuevoRol
  }

  return { rol, nombre, esMiembro, actuarComo }
})

export { useSesionStore }
