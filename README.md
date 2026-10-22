# Nodo: Espacios y recursos (prototipo)

Prototipo del área **Espacios y recursos** del coworking Nodo. El código usa el lenguaje ubicuo, respeta las fronteras de los bounded contexts y sigue el flujo del EventStorming. Los datos viven en memoria y se reinician con el botón «Reiniciar».

## Cómo correrlo

```bash
nub install
nub run dev        # http://localhost:3000
```

El selector de sesión de la barra superior cambia el rol del usuario (Dirección, Operaciones, Recepción, Miembro). Cada comando se valida con ese rol: si Recepción intenta habilitar un espacio, se rechaza con su motivo. El botón ↺ restablece los datos de prueba.

Las fechas se guardan en UTC y se muestran en la zona horaria del navegador. El navegador la guarda en la cookie `nodo-zona-horaria` para que el servidor muestre las mismas horas, y los datos de prueba se crean en esa zona.

## Stack

Nuxt 4, Vue 3, TypeScript, Nuxt UI, Pinia. El backend es mock: endpoints Nitro con datos en memoria.

## El context map hecho carpetas

Cada bounded context es una *layer* de Nuxt en `layers/`. Cada una tiene su dominio, su servidor y su interfaz:

```text
layers/
├─ compartido/            Lo mínimo común: Rol, Resultado, EventoDeDominio, el bus de eventos y la sesión
├─ inventario-espacios/   ★ Qué espacios existen, su tipo, aforo y buffer (Dirección)
├─ estado-operativo/      ★ Incidentes, bloqueos y ocupación de hoy (Operaciones y Recepción)
├─ reservas/              Vecino: recursos reservables, franjas y reasignaciones
├─ eventos/               Vecino: alquiler del salón y aprobación de eventos grandes
└─ notificaciones/        Transversal: escucha eventos y envía avisos
```

Las dos ★ forman nuestra área. Dentro de cada layer:

- `shared/dominio/`: el modelo en TypeScript puro, sin Vue. Lo usan el servidor y la interfaz.
- `server/`: endpoints mock (`api/`), datos en memoria (`utils/`) y suscripciones a eventos de otros contextos (`plugins/`).
- `app/`: páginas, componentes, stores, composables y servicios.

**Los contextos no comparten modelos.** Se enteran de lo que pasa en los demás solo por los eventos de dominio, y cada uno los traduce a su propio lenguaje. Por ejemplo, `EspacioHabilitado` llega a Reservas y se convierte en un `RecursoReservable`. Todos los imports son explícitos (`#inventario-espacios/...`, `#reservas/...`), así que se puede seguir en el código qué contexto depende de cuál.

## Del glosario al código

| Glosario | Código |
|---|---|
| Espacio, tipo de espacio, aforo, buffer | `Espacio`, `TipoEspacio`, `aforo`, `bufferEnMinutos` |
| Habilitar, dar de baja | `espacio.habilitar()`, `espacio.darDeBaja()` |
| Incidente, bloquear, rehabilitar, liberar | `registrarIncidente()`, `bloquear()`, `rehabilitar()`, `liberar()` |
| «Disponible» en Inventario | `estaHabilitado()` |
| «Disponible» en Estado operativo | `estaLibreAhora()`, `EstadoOperativo.LIBRE_AHORA` |
| Reasignar a un espacio equivalente | `reserva.reasignar()` |

Cada comando devuelve un `Resultado`: el evento de dominio si se cumplen las reglas, o el motivo del rechazo si no.

