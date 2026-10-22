<script setup lang="ts">
import { computed, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import RolSelector from '#compartido/app/components/RolSelector.vue'
import { useSesionStore } from '#compartido/app/stores/sesion.store'
import { useSincronizacionStore } from '#compartido/app/stores/sincronizacion.store'
import AvisosPanel from '#notificaciones/app/components/AvisosPanel.vue'
import type { Rol } from '#compartido/shared/rol'
import { puedeVer, rutaDeInicio, seccionesPara } from '~/constants/secciones'

const route = useRoute()
const sesion = useSesionStore()
const sincronizacion = useSincronizacionStore()

const secciones = computed(() => seccionesPara(sesion.rol))

async function handleRestablecer(): Promise<void> {
  await sincronizacion.restablecerDatos()
}

async function llevarASeccionPermitida(rol: Rol): Promise<void> {
  if (!puedeVer(rol, route.path)) await navigateTo(rutaDeInicio(rol))
}

watch(() => sesion.rol, llevarASeccionPermitida)
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b border-default bg-default/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/logo-nodo.png" alt="" class="size-7">
          <span class="text-lg font-semibold tracking-wide text-primary-800">Nodo</span>
          <span class="text-xs text-muted">Espacios y recursos</span>
        </NuxtLink>
        <UNavigationMenu :items="secciones" class="flex-1" />
        <RolSelector />
        <AvisosPanel />
        <UTooltip text="Restablecer datos de prueba">
          <UButton
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="outline"
            size="sm"
            aria-label="Restablecer datos de prueba"
            @click="handleRestablecer"
          />
        </UTooltip>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
