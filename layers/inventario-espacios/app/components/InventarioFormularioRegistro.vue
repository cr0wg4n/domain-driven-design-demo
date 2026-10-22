<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { SolicitudDeRegistro } from '#inventario-espacios/shared/dominio/espacio'
import { NOMBRE_DE_TIPO, TipoEspacio } from '#inventario-espacios/shared/dominio/tipo-espacio'

interface InventarioFormularioRegistroEmits {
  (event: 'registrar', solicitud: SolicitudDeRegistro): void
}

const emit = defineEmits<InventarioFormularioRegistroEmits>()

const estaAbierto = ref(false)
const solicitud = reactive<SolicitudDeRegistro>({ nombre: '', tipo: TipoEspacio.OFICINA_PRIVADA, aforo: 4 })

const tipos = Object.values(TipoEspacio).map(tipo => ({ label: NOMBRE_DE_TIPO[tipo], value: tipo }))

function handleRegistrar(): void {
  emit('registrar', { ...solicitud })
  estaAbierto.value = false
  solicitud.nombre = ''
}
</script>

<template>
  <UModal v-model:open="estaAbierto" title="Registrar espacio" description="El espacio queda registrado; Dirección debe habilitarlo para ofrecerlo.">
    <UButton label="Registrar espacio" icon="i-lucide-plus" />
    <template #body>
      <form id="registro-de-espacio" class="space-y-4" @submit.prevent="handleRegistrar">
        <UFormField label="Nombre">
          <UInput v-model="solicitud.nombre" placeholder="Oficina privada 4" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Tipo de espacio">
            <USelect v-model="solicitud.tipo" :items="tipos" class="w-full" />
          </UFormField>
          <UFormField label="Aforo">
            <UInputNumber v-model="solicitud.aforo" :min="1" class="w-full" />
          </UFormField>
        </div>
      </form>
    </template>
    <template #footer>
      <UButton type="submit" form="registro-de-espacio" label="Registrar" />
    </template>
  </UModal>
</template>
