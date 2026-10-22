<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RecursoReservable } from '#reservas/shared/dominio/recurso-reservable'

interface ReservaReasignacionProps {
  recursos: RecursoReservable[]
  recursoActualId: string
}

interface ReservaReasignacionEmits {
  (event: 'reasignar', recursoId: string): void
}

const props = defineProps<ReservaReasignacionProps>()
const emit = defineEmits<ReservaReasignacionEmits>()

const recursoId = ref('')

const opciones = computed(() =>
  props.recursos
    .filter(recurso => recurso.recursoId !== props.recursoActualId)
    .map(recurso => ({ label: `${recurso.nombre} (aforo ${recurso.aforo})`, value: recurso.recursoId }))
)

function handleReasignar(): void {
  emit('reasignar', recursoId.value)
}
</script>

<template>
  <div class="flex items-center justify-end gap-1">
    <USelect v-model="recursoId" :items="opciones" placeholder="Espacio equivalente" size="xs" class="w-52" />
    <UButton label="Reasignar" size="xs" :disabled="!recursoId" @click="handleReasignar" />
  </div>
</template>
