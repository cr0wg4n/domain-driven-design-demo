import { defineEventHandler } from 'h3'
import { leerCuerpo } from '#compartido/server/utils/comando'
import type { PedidoDeEvento } from '#eventos/shared/dominio/solicitud-de-evento'
import { solicitarEvento } from '#eventos/server/utils/agenda'

export default defineEventHandler(async (event) => {
  const pedido = await leerCuerpo<PedidoDeEvento>(event)
  return solicitarEvento({ ...pedido, organizador: pedido.organizador ?? '', asistentes: Number(pedido.asistentes) })
})
