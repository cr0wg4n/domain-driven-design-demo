<script setup lang="ts">
import { computed } from 'vue'
import { NOMBRE_DE_ROL, Rol } from '#compartido/shared/rol'
import { sesionDe } from '#compartido/shared/sesion'
import { useSesionStore } from '#compartido/app/stores/sesion.store'

const sesion = useSesionStore()

function etiquetaDe(rol: Rol): string {
  const { nombre } = sesionDe(rol)
  return nombre === NOMBRE_DE_ROL[rol] ? nombre : `${NOMBRE_DE_ROL[rol]}: ${nombre}`
}

const opciones = Object.values(Rol).map(rol => ({ label: etiquetaDe(rol), value: rol }))

const rol = computed({
  get: () => sesion.rol,
  set: (nuevoRol: Rol) => sesion.actuarComo(nuevoRol)
})
</script>

<template>
  <USelect
    v-model="rol"
    :items="opciones"
    size="sm"
    class="w-48"
    icon="i-lucide-circle-user-round"
    aria-label="Sesión"
  />
</template>
