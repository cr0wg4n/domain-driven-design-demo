import { ref } from 'vue'
import { useToast } from '#imports'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import type { Resultado } from '#compartido/shared/resultado'
import { enviarComando } from '#compartido/app/services/api.service'
import { useSesionStore } from '#compartido/app/stores/sesion.store'
import { useSincronizacionStore } from '#compartido/app/stores/sincronizacion.store'
import { oracionDesde } from '#compartido/app/utils/formato.util'

function useComando() {
  const estaEnviando = ref(false)
  const toast = useToast()
  const sesion = useSesionStore()
  const sincronizacion = useSincronizacionStore()

  async function ejecutar(ruta: string, cuerpo?: object): Promise<Resultado<EventoDeDominio>> {
    estaEnviando.value = true
    const resultado = await enviarComando<EventoDeDominio>(ruta, sesion.rol, cuerpo)
    estaEnviando.value = false

    if (resultado.esExitoso) {
      toast.add({ title: oracionDesde(resultado.valor.nombre), color: 'success', icon: 'i-lucide-check' })
      sincronizacion.notificarCambio()
    } else {
      toast.add({ title: 'No se pudo completar', description: resultado.motivo, color: 'error', icon: 'i-lucide-ban' })
    }
    return resultado
  }

  async function ejecutarYRecargar(ruta: string, recargar: () => Promise<void>, cuerpo?: object): Promise<boolean> {
    const { esExitoso } = await ejecutar(ruta, cuerpo)
    if (esExitoso) await recargar()
    return esExitoso
  }

  return { ejecutar, ejecutarYRecargar, estaEnviando }
}

export { useComando }
