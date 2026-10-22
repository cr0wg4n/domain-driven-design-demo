<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useSesionStore } from '#compartido/app/stores/sesion.store'
import { useSincronizacionStore } from '#compartido/app/stores/sincronizacion.store'
import AvisosLista from '#notificaciones/app/components/AvisosLista.vue'
import { useAvisosStore } from '#notificaciones/app/stores/avisos.store'

const estaAbierto = ref(false)

const store = useAvisosStore()
const sesion = useSesionStore()
const sincronizacion = useSincronizacionStore()

function handleAbrir(abierto: boolean): void {
  estaAbierto.value = abierto
  if (abierto) store.marcarComoLeidos()
}

watch(() => sincronizacion.version, store.cargar)
watch(() => sesion.rol, store.cargar)

onMounted(store.cargar)
</script>

<template>
  <USlideover
    :open="estaAbierto"
    side="right"
    title="Avisos"
    :description="`Para ${sesion.nombre}`"
    @update:open="handleAbrir"
  >
    <UChip :text="store.cantidadNoLeidos" :show="store.cantidadNoLeidos > 0" size="3xl" color="primary">
      <UButton icon="i-lucide-bell" color="neutral" variant="outline" size="sm" aria-label="Avisos" />
    </UChip>
    <template #body>
      <AvisosLista :avisos="store.avisos" />
    </template>
  </USlideover>
</template>
