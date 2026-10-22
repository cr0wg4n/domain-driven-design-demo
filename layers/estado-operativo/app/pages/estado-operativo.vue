<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useSincronizacionStore } from '#compartido/app/stores/sincronizacion.store'
import { usePermisos } from '#compartido/app/composables/usePermisos'
import { QUIENES_BLOQUEAN, QUIENES_MARCAN_OCUPACION, QUIENES_REGISTRAN_INCIDENTES } from '#estado-operativo/shared/dominio/espacio-operativo'
import OcupacionTarjeta from '#estado-operativo/app/components/OcupacionTarjeta.vue'
import { useEstadoOperativo } from '#estado-operativo/app/composables/useEstadoOperativo'
import { useEstadoOperativoStore } from '#estado-operativo/app/stores/estado-operativo.store'
import { PRESENTACION_DE_ESTADO } from '#estado-operativo/app/utils/presentacion.util'

const store = useEstadoOperativoStore()
const sincronizacion = useSincronizacionStore()
const { registrarIncidente, bloquear, rehabilitar, marcarOcupado, liberar } = useEstadoOperativo()
const { puede } = usePermisos()

const permisos = computed(() => ({
  puedeMarcarOcupacion: puede(QUIENES_MARCAN_OCUPACION),
  puedeRegistrarIncidente: puede(QUIENES_REGISTRAN_INCIDENTES),
  puedeBloquear: puede(QUIENES_BLOQUEAN)
}))

async function handleRegistrarIncidente(id: string, descripcion: string): Promise<void> {
  await registrarIncidente(id, descripcion)
}

async function handleBloquear(id: string): Promise<void> {
  await bloquear(id)
}

async function handleRehabilitar(id: string): Promise<void> {
  await rehabilitar(id)
}

async function handleMarcarOcupado(id: string): Promise<void> {
  await marcarOcupado(id)
}

async function handleLiberar(id: string): Promise<void> {
  await liberar(id)
}

watch(() => sincronizacion.version, store.cargar)

onMounted(store.cargar)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Estado operativo</h1>
        <p class="mt-1 text-muted">Ocupación de hoy</p>
      </div>
      <div class="flex gap-2">
        <UBadge
          v-for="{ estado, cantidad } in store.cantidadPorEstado"
          :key="estado"
          :label="`${PRESENTACION_DE_ESTADO[estado].etiqueta}: ${cantidad}`"
          :color="PRESENTACION_DE_ESTADO[estado].color"
          variant="outline"
        />
      </div>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <OcupacionTarjeta
        v-for="espacio in store.espacios"
        :key="espacio.espacioId"
        :espacio="espacio"
        v-bind="permisos"
        @registrar-incidente="handleRegistrarIncidente(espacio.espacioId, $event)"
        @bloquear="handleBloquear(espacio.espacioId)"
        @rehabilitar="handleRehabilitar(espacio.espacioId)"
        @marcar-ocupado="handleMarcarOcupado(espacio.espacioId)"
        @liberar="handleLiberar(espacio.espacioId)"
      />
    </div>
  </div>
</template>
