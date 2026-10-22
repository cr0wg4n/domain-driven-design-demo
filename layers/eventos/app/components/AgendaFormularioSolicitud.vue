<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Bloque } from '#eventos/shared/dominio/solicitud-de-evento'
import type { PedidoDeEvento } from '#eventos/shared/dominio/solicitud-de-evento'
import { NOMBRE_DE_BLOQUE } from '#eventos/app/utils/presentacion.util'

interface AgendaFormularioSolicitudEmits {
  (event: 'solicitar', pedido: PedidoDeEvento): void
}

const emit = defineEmits<AgendaFormularioSolicitudEmits>()

const estaAbierto = ref(false)
const pedido = reactive<PedidoDeEvento>({ organizador: '', asistentes: 40, bloque: Bloque.MEDIO_DIA })

const bloques = Object.values(Bloque).map(bloque => ({ label: NOMBRE_DE_BLOQUE[bloque], value: bloque }))

function handleSolicitar(): void {
  emit('solicitar', { ...pedido })
  estaAbierto.value = false
  pedido.organizador = ''
}
</script>

<template>
  <UModal v-model:open="estaAbierto" title="Solicitar el salón" description="Si los asistentes superan el aforo del salón, Dirección debe aprobarlo.">
    <UButton label="Solicitar evento" icon="i-lucide-plus" />
    <template #body>
      <form id="solicitud-de-evento" class="space-y-4" @submit.prevent="handleSolicitar">
        <UFormField label="Organizador">
          <UInput v-model="pedido.organizador" placeholder="Empresa u organización" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Asistentes">
            <UInputNumber v-model="pedido.asistentes" :min="1" class="w-full" />
          </UFormField>
          <UFormField label="Bloque">
            <USelect v-model="pedido.bloque" :items="bloques" class="w-full" />
          </UFormField>
        </div>
      </form>
    </template>
    <template #footer>
      <UButton type="submit" form="solicitud-de-evento" label="Solicitar" />
    </template>
  </UModal>
</template>
