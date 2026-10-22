<script setup lang="ts">
import { EstadoDeSolicitud } from '#eventos/shared/dominio/solicitud-de-evento'
import type { DatosDeSolicitud } from '#eventos/shared/dominio/solicitud-de-evento'
import { NOMBRE_DE_BLOQUE, PRESENTACION_DE_SOLICITUD } from '#eventos/app/utils/presentacion.util'

interface AgendaSolicitudesProps {
  solicitudes: DatosDeSolicitud[]
  puedeAprobar: boolean
}

interface AgendaSolicitudesEmits {
  (event: 'aprobar', id: string): void
}

const props = defineProps<AgendaSolicitudesProps>()
const emit = defineEmits<AgendaSolicitudesEmits>()

function sePuedeAprobar(solicitud: DatosDeSolicitud): boolean {
  return props.puedeAprobar && solicitud.estado === EstadoDeSolicitud.PENDIENTE_DE_APROBACION
}

function handleAprobar(id: string): void {
  emit('aprobar', id)
}
</script>

<template>
  <ul class="divide-y divide-default rounded-md border border-default bg-default">
    <li v-for="solicitud in solicitudes" :key="solicitud.id" class="flex flex-wrap items-center gap-3 px-4 py-3">
      <div class="min-w-0 flex-1">
        <p class="font-medium">{{ solicitud.organizador }}</p>
        <p class="text-sm text-muted">{{ solicitud.asistentes }} personas, {{ NOMBRE_DE_BLOQUE[solicitud.bloque].toLowerCase() }}</p>
      </div>
      <UBadge
        :label="PRESENTACION_DE_SOLICITUD[solicitud.estado].etiqueta"
        :color="PRESENTACION_DE_SOLICITUD[solicitud.estado].color"
        variant="subtle"
      />
      <UButton v-if="sePuedeAprobar(solicitud)" label="Aprobar" size="xs" @click="handleAprobar(solicitud.id)" />
    </li>
  </ul>
</template>
