import type { Sesion } from '#compartido/shared/sesion'
import { esParaLaSesion } from '#notificaciones/shared/aviso'
import type { Aviso } from '#notificaciones/shared/aviso'

const LIMITE_DE_AVISOS = 100

let avisos: Aviso[] = []

function enviarAviso(aviso: Omit<Aviso, 'id' | 'enviadoEn'>): void {
  avisos = [{ ...aviso, id: crypto.randomUUID(), enviadoEn: new Date().toISOString() }, ...avisos].slice(0, LIMITE_DE_AVISOS)
}

function avisosPara(sesion: Sesion): Aviso[] {
  return avisos.filter(aviso => esParaLaSesion(aviso, sesion))
}

function vaciarAvisos(): void {
  avisos = []
}

export { enviarAviso, avisosPara, vaciarAvisos }
