# Nodo: Espacios y recursos (prototipo)

Nodo es un coworking ficticio que usamos como caso del curso de Domain-Driven Design. Esta aplicación es un prototipo de nuestra área, **Espacios y recursos**, que responde dos preguntas:

- **¿Qué espacios tiene Nodo?** Salas, oficinas y escritorios, con su tipo, cuántas personas caben (aforo) y cuánto tiempo hay que dejar libre entre una reserva y la siguiente (buffer).
- **¿En qué estado está cada espacio hoy?** Si está libre, ocupado o en mantenimiento por un desperfecto.

No hay base de datos: todo se guarda en memoria mientras la aplicación está abierta, y se puede volver a los datos de prueba con un botón.

## Cómo ponerla en marcha

### 1. Instala nub

Lo único que hace falta instalar es **nub**, la herramienta que usa el proyecto para manejar Node.js y las dependencias. Se descarga desde [nubjs.com](https://nubjs.com) (documentación en [nubjs.com/docs](https://nubjs.com/docs)):

```bash
# macOS o Linux
curl -fsSL https://nubjs.com/install.sh | bash

# Windows (PowerShell)
irm https://nubjs.com/install.ps1 | iex
```

Para comprobar que quedó instalado, abre una terminal nueva y escribe `nub --version`.

No hace falta instalar Node.js aparte. El archivo `.node-version` indica qué versión usa el proyecto (la 26) y nub la descarga sola la primera vez.

### 2. Descarga Node.js y las dependencias

Dentro de la carpeta `proyecto-nodo/`:

```bash
nub node install   # descarga la versión de Node.js indicada en .node-version
nub install        # descarga las dependencias del proyecto
```

### 3. Abre la aplicación

```bash
nub run dev
```

Cuando la terminal diga "Ready", abre [http://localhost:3000](http://localhost:3000) en el navegador. Para detenerla, vuelve a la terminal y presiona `Ctrl + C`.

## Qué se puede probar

Arriba a la derecha hay un selector para elegir **quién eres**. Cada rol puede hacer cosas distintas, igual que en el coworking real:

| Rol | Qué puede hacer |
|---|---|
| **Dirección** | Registrar espacios nuevos, habilitarlos, cambiar su aforo, darlos de baja y bloquearlos |
| **Operaciones** | Reportar incidentes, bloquear un espacio por mantenimiento y volver a habilitarlo |
| **Recepción** | Marcar un espacio como ocupado o liberarlo cuando la gente se va |
| **Miembro** | Ver la información y hacer reservas |

Si intentas algo que tu rol no puede hacer, la aplicación lo rechaza y te dice por qué. Por ejemplo, Recepción no puede habilitar un espacio.

Un recorrido corto:

1. Elige **Dirección**, entra en **Inventario** y habilita la "Oficina privada 3", que está recién registrada.
2. Entra en **Estado operativo**: la oficina ya aparece ahí, libre.
3. Cambia a **Operaciones** y bloquea una sala. Pasa a "En mantenimiento".
4. Entra en **Reservas**: esa sala ya no se puede reservar, y sus reservas quedan marcadas para reasignar.
5. La campana muestra los avisos que se enviaron. El botón de reinicio vuelve todo a los datos de prueba.

Las fechas y horas se muestran en la zona horaria de tu navegador.

## Cómo está organizado el código

La aplicación usa [Nuxt 4](https://nuxt.com/) (Vue 3 y TypeScript), con [Nuxt UI](https://ui.nuxt.com/) para la interfaz y Pinia para el estado. El servidor es una simulación: responde como un servidor real, pero guarda todo en memoria.

### Una carpeta por contexto

En DDD, un *bounded context* es una parte del sistema con su propio lenguaje y sus propias reglas. En este proyecto, cada uno es una carpeta dentro de `layers/`:

```text
layers/
├─ compartido/            Lo poco que usan todos: roles, sesión y el canal de eventos
├─ inventario-espacios/   (*) Qué espacios existen, su tipo, aforo y buffer (lo maneja Dirección)
├─ estado-operativo/      (*) Incidentes, bloqueos y ocupación del día (Operaciones y Recepción)
├─ reservas/              Vecino: reservas de espacios y reasignaciones
├─ eventos/               Vecino: alquiler del salón para eventos grandes
└─ notificaciones/        Escucha lo que pasa en los demás y envía avisos
```

Las dos carpetas con (*) son nuestra área; las demás existen para mostrar cómo se conecta con el resto de Nodo. Dentro de cada una:

- `shared/dominio/`: las reglas del negocio, en TypeScript puro. Las usan tanto el servidor como la interfaz.
- `server/`: la API (`api/`), los casos de uso (`services/`), el almacenamiento en memoria (`repositories/`) y las reacciones a lo que pasa en otros contextos (`plugins/`).
- `app/`: lo que se ve en pantalla: páginas, componentes y estado.

### Los contextos se hablan con eventos

Ningún contexto usa el modelo de otro. Cuando algo importante ocurre, el contexto lo anuncia como un **evento** ("espacio habilitado", "espacio bloqueado") y los demás reaccionan a su manera. Por ejemplo, cuando Inventario anuncia `EspacioHabilitado`, Reservas lo convierte en un recurso que se puede reservar.

Así se puede cambiar un contexto sin romper los otros, y los imports (`#inventario-espacios/...`, `#reservas/...`) muestran a simple vista quién depende de quién.

### Patrones tácticos de nuestra área

- **Agregado** (`Espacio`, `EspacioOperativo`): el objeto que cuida sus propias reglas. Nadie puede dejarlo en un estado inválido.
- **Repositorio** (`EspacioRepository`, `EspacioOperativoRepository`): donde se guardan los agregados. Hoy es memoria; mañana podría ser una base de datos sin tocar las reglas.
- **Servicio de aplicación** (`InventarioService`, `EstadoOperativoService`): coordina cada acción en cuatro pasos: buscar el espacio, pedirle que haga el cambio, guardarlo y anunciar el evento.
- **Fábrica**: los métodos `Espacio.registrar`, `Espacio.desdeDatos` y `EspacioOperativo.incorporar`, que garantizan que un espacio nazca válido.
- **Servicio de dominio**: no hizo falta, porque ninguna regla necesita a dos agregados a la vez.

## Del glosario al código

Las palabras del glosario del área son las mismas que se usan en el código:

| En el glosario | En el código |
|---|---|
| Espacio, tipo de espacio, aforo, buffer | `Espacio`, `TipoEspacio`, `aforo`, `bufferEnMinutos` |
| Habilitar, dar de baja | `espacio.habilitar()`, `espacio.darDeBaja()` |
| Incidente, bloquear, rehabilitar, liberar | `registrarIncidente()`, `bloquear()`, `rehabilitar()`, `liberar()` |
| "Disponible" en Inventario | `estaHabilitado()` |
| "Disponible" en Estado operativo | `estaLibreAhora()`, `EstadoOperativo.LIBRE_AHORA` |
| Reasignar a un espacio equivalente | `reserva.reasignar()` |

Cada acción devuelve un `Resultado`: el evento, si se cumplieron las reglas, o el motivo del rechazo, si no.
