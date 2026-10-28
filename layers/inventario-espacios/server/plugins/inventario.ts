import { defineNitroPlugin } from 'nitropack/runtime'
import { alReiniciar, alSembrar } from '#compartido/server/utils/demo'
import { inventarioService } from '#inventario-espacios/server/services/inventario.service'

export default defineNitroPlugin(() => {
  alReiniciar(() => inventarioService.reiniciar())
  alSembrar(1, () => inventarioService.sembrar())
})
