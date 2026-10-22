<script setup lang="ts">
import { computed } from 'vue'
import { EstadoOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import type { DatosDeEspacioOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import { PRESENTACION_DE_ESTADO } from '#estado-operativo/app/utils/presentacion.util'
import OcupacionIncidenteFormulario from '#estado-operativo/app/components/OcupacionIncidenteFormulario.vue'

interface OcupacionTarjetaProps {
  espacio: DatosDeEspacioOperativo
  puedeMarcarOcupacion: boolean
  puedeRegistrarIncidente: boolean
  puedeBloquear: boolean
}

interface OcupacionTarjetaEmits {
  (event: 'registrarIncidente', descripcion: string): void
  (event: 'bloquear' | 'rehabilitar' | 'marcarOcupado' | 'liberar'): void
}

const props = defineProps<OcupacionTarjetaProps>()
const emit = defineEmits<OcupacionTarjetaEmits>()

const presentacion = computed(() => PRESENTACION_DE_ESTADO[props.espacio.estado])
const estaLibreAhora = computed(() => props.espacio.estado === EstadoOperativo.LIBRE_AHORA)
const estaOcupado = computed(() => props.espacio.estado === EstadoOperativo.OCUPADO)
const estaEnMantenimiento = computed(() => props.espacio.estado === EstadoOperativo.EN_MANTENIMIENTO)
const puedeReportarIncidente = computed(() => props.puedeRegistrarIncidente && !props.espacio.incidente)
const tieneAcciones = computed(() => props.puedeMarcarOcupacion || props.puedeRegistrarIncidente || props.puedeBloquear)

function handleRegistrarIncidente(descripcion: string): void {
  emit('registrarIncidente', descripcion)
}

function handleBloquear(): void {
  emit('bloquear')
}

function handleRehabilitar(): void {
  emit('rehabilitar')
}

function handleMarcarOcupado(): void {
  emit('marcarOcupado')
}

function handleLiberar(): void {
  emit('liberar')
}
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-md border bg-default p-3"
    :class="estaEnMantenimiento ? 'border-warning/50 bg-warning/5' : 'border-default'"
  >
    <div class="flex items-start justify-between gap-2">
      <span class="font-medium">{{ espacio.nombre }}</span>
      <UBadge :label="presentacion.etiqueta" :color="presentacion.color" :icon="presentacion.icono" variant="subtle" size="sm" />
    </div>
    <p v-if="espacio.incidente" class="flex gap-1.5 text-sm text-muted">
      <UIcon name="i-lucide-triangle-alert" class="mt-0.5 shrink-0 text-warning" />
      {{ espacio.incidente.descripcion }}
    </p>
    <div v-if="tieneAcciones" class="mt-auto flex flex-wrap gap-1">
      <template v-if="puedeMarcarOcupacion">
        <UButton v-if="estaLibreAhora" label="Ocupar" color="neutral" variant="outline" size="xs" @click="handleMarcarOcupado" />
        <UButton v-if="estaOcupado" label="Liberar" color="neutral" variant="outline" size="xs" @click="handleLiberar" />
      </template>
      <OcupacionIncidenteFormulario v-if="puedeReportarIncidente" @registrar="handleRegistrarIncidente" />
      <template v-if="puedeBloquear">
        <UButton v-if="!estaEnMantenimiento" label="Bloquear" color="warning" variant="outline" size="xs" @click="handleBloquear" />
        <UButton v-else label="Rehabilitar" size="xs" @click="handleRehabilitar" />
      </template>
    </div>
  </div>
</template>
