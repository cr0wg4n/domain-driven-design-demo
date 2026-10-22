import { exito, rechazo } from '#compartido/shared/resultado'
import type { Resultado } from '#compartido/shared/resultado'
import type { Rol } from '#compartido/shared/rol'

const CABECERA_DE_ROL = 'x-rol'
const MOTIVO_DESCONOCIDO = 'No se pudo completar el comando'

interface RespuestaDeRechazo {
  data?: { data?: { motivo?: string } }
}

interface OpcionesDePedido {
  method?: 'GET' | 'POST'
  body?: object
  headers?: Record<string, string>
}

const pedir = $fetch as unknown as <T>(ruta: string, opciones?: OpcionesDePedido) => Promise<T>

async function consultar<T>(ruta: string): Promise<T> {
  return await pedir<T>(ruta)
}

async function enviarComando<T>(ruta: string, rol: Rol, cuerpo?: object): Promise<Resultado<T>> {
  try {
    const valor = await pedir<T>(ruta, { method: 'POST', body: cuerpo, headers: { [CABECERA_DE_ROL]: rol } })
    return exito(valor)
  } catch (error) {
    return rechazo((error as RespuestaDeRechazo).data?.data?.motivo ?? MOTIVO_DESCONOCIDO)
  }
}

export { consultar, enviarComando }
