<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useSincronizacionStore } from '#compartido/app/stores/sincronizacion.store'
import type { SolicitudDeRegistro } from '#inventario-espacios/shared/dominio/espacio'
import InventarioFormularioRegistro from '#inventario-espacios/app/components/InventarioFormularioRegistro.vue'
import InventarioTabla from '#inventario-espacios/app/components/InventarioTabla.vue'
import { useInventario } from '#inventario-espacios/app/composables/useInventario'
import { useInventarioStore } from '#inventario-espacios/app/stores/inventario.store'

const store = useInventarioStore()
const sincronizacion = useSincronizacionStore()
const { registrar, habilitar, cambiarAforo, darDeBaja } = useInventario()

const resumen = computed(() => `${store.espacios.length} espacios registrados`)

async function handleRegistrar(solicitud: SolicitudDeRegistro): Promise<void> {
  await registrar(solicitud)
}

async function handleHabilitar(id: string): Promise<void> {
  await habilitar(id)
}

async function handleCambiarAforo({ id, aforo }: { id: string, aforo: number }): Promise<void> {
  await cambiarAforo(id, aforo)
}

async function handleDarDeBaja(id: string): Promise<void> {
  await darDeBaja(id)
}

watch(() => sincronizacion.version, store.cargar)

onMounted(store.cargar)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Inventario de espacios</h1>
        <p class="mt-1 text-muted">{{ resumen }}</p>
      </div>
      <InventarioFormularioRegistro @registrar="handleRegistrar" />
    </div>
    <InventarioTabla
      :espacios="store.espacios"
      @habilitar="handleHabilitar"
      @cambiar-aforo="handleCambiarAforo"
      @dar-de-baja="handleDarDeBaja"
    />
  </div>
</template>
