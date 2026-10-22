<script setup lang="ts">
import { computed } from 'vue'
import { useZonaHoraria } from '#compartido/app/composables/useZonaHoraria'

interface ReservasNavegadorDiaProps {
  dia: string
  esHoy: boolean
}

interface ReservasNavegadorDiaEmits {
  (event: 'mover', dias: number): void
  (event: 'irAHoy'): void
}

const props = defineProps<ReservasNavegadorDiaProps>()
const emit = defineEmits<ReservasNavegadorDiaEmits>()
const { nombreDelDia } = useZonaHoraria()

const titulo = computed(() => nombreDelDia(props.dia))

function handleAnterior(): void {
  emit('mover', -1)
}

function handleSiguiente(): void {
  emit('mover', 1)
}

function handleHoy(): void {
  emit('irAHoy')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UButton icon="i-lucide-chevron-left" color="neutral" variant="outline" size="sm" aria-label="Día anterior" @click="handleAnterior" />
    <UButton label="Hoy" color="neutral" variant="outline" size="sm" :disabled="esHoy" @click="handleHoy" />
    <UButton icon="i-lucide-chevron-right" color="neutral" variant="outline" size="sm" aria-label="Día siguiente" @click="handleSiguiente" />
    <span class="ml-2 inline-block font-medium first-letter:uppercase">{{ titulo }}</span>
  </div>
</template>
