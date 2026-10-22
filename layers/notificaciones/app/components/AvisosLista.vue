<script setup lang="ts">
import { Canal } from '#notificaciones/shared/aviso'
import type { Aviso } from '#notificaciones/shared/aviso'
import { useZonaHoraria } from '#compartido/app/composables/useZonaHoraria'

interface AvisosListaProps {
  avisos: Aviso[]
}

defineProps<AvisosListaProps>()

const { hora } = useZonaHoraria()

const ICONO_DE_CANAL: Record<Canal, string> = {
  [Canal.CORREO]: 'i-lucide-mail',
  [Canal.MENSAJERIA]: 'i-lucide-message-circle'
}
</script>

<template>
  <p v-if="avisos.length === 0" class="text-sm text-muted">
    Sin avisos todavía.
  </p>
  <ul v-else class="space-y-3">
    <li v-for="aviso in avisos" :key="aviso.id" class="flex gap-3">
      <UIcon :name="ICONO_DE_CANAL[aviso.canal]" class="mt-0.5 shrink-0 text-primary-600" />
      <div class="min-w-0 text-sm">
        <p>{{ aviso.mensaje }}</p>
        <p class="text-xs text-muted tabular-nums">{{ hora(aviso.enviadoEn) }}</p>
      </div>
    </li>
  </ul>
</template>
