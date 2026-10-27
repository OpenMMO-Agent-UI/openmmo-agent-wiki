---
title: 'Instalación y primer inicio'
description: 'Abrirlo por primera vez (en macOS simplemente se abre; en Windows hace falta Ejecutar de todas formas), iniciar sesión con Google, crear un personaje y entrar a jugar.'
---

## Abrirlo por primera vez

### macOS — simplemente se abre

**La compilación de macOS está firmada con un Apple Developer ID, notarizada por Apple y lleva el ticket grapado en la app.** Descomprime, haz doble clic y se ejecuta sin aviso de Gatekeeper.

No necesitas clic derecho → Abrir, ni `xattr -cr`: el consejo que encontrarás en internet para apps sin firmar no aplica a esta compilación.

### Windows — un clic extra

**La compilación de Windows no está firmada**, así que SmartScreen muestra «Windows protegió su PC». Pulsa **Más información** → **Ejecutar de todas formas**.

Los certificados de firma de código cuestan dinero cada año y por ahora solo hay uno, para macOS. Si el proyecto te resulta útil, [apoyarlo](https://ko-fi.com/dakywang) ayuda a poner un certificado de Windows al alcance.

### Linux — marca el bit de ejecución

Los AppImage no tienen firma de la que hablar; solo necesitan ser ejecutables:

```bash
chmod +x openmmo-agent-*linux-x64.AppImage
./openmmo-agent-*linux-x64.AppImage
```

## Primer inicio

Cuatro pantallas en orden y estás en el juego. **No hay un paso «Jugar» aparte**: elegir un personaje entra a jugar de inmediato.

### 1. Servidor — elige un perfil de conexión

El perfil integrado `openmmo.to.nexus` es fijo, y es el que quiere la mayoría.

Un perfil une tres cosas: la URL del servidor, el origen de los recursos de terreno y un ID/secreto de cliente de Google. Tienen que viajar juntos, porque un servidor solo acepta tokens emitidos por un ID de cliente de su propia lista. Si gestionas tu propio servidor puedes crear, editar, duplicar y borrar perfiles, y probar la conexión antes de usarlo.

### 2. Inicio de sesión — flujo de dispositivo de Google

Pulsa el botón y aparece un código; introdúcelo en tu navegador. Una credencial en caché salta directa al paso siguiente.

### 3. Personaje — elige o crea

Dos pestañas:

- **Elige tu personaje** — hasta 3 por cuenta (lo impone el servidor). Haz clic para entrar a jugar, o bórralo.
- **Crear un personaje nuevo** — nombre, clase, género. Se oculta cuando llegas al tope.

### 4. Juego

El modo se decide por ti al entrar: **automático si hay un backend LLM configurado y pasa la validación, manual en caso contrario**. Si el automático no arranca, cae a manual. Puedes cambiar en cualquier momento desde la cabecera.

## Los dos modos de juego

El servidor permite exactamente una sesión de control por personaje, así que los dos modos llegan ahí de forma distinta.

**El juego manual** es una conexión directa: el cliente web de OpenMMO incrustado inicia sesión con tu propia cuenta de Google y habla directamente con el servidor, igual que jugar en un navegador. Sin relé, sin `agent-client`.

**El juego automático** lanza `agent-client`, que necesita esa única sesión para sí — así que verlo no puede significar iniciar sesión a su lado. En su lugar, un relé se sitúa en loopback:

```
agent-client <--ws--> proxy (127.0.0.1) <--wss--> openmmo.to.nexus
                        |
                        +--> espectadores (/mirror)
```

El servidor no tiene idea de que hay algo detrás del agente. Estar en medio permite al relé duplicar cada mensaje del servidor hacia una vista de espectador de solo lectura. **El relé escucha solo en `127.0.0.1`, así que nada sale de tu máquina.**

## La pantalla de juego

La cabecera muestra el estado de conexión, las constantes, el uso de memoria del espectador, un botón para recargar la vista 3D, el conmutador manual/IA y botones para cambiar de personaje o de servidor. Cambia un ajuste con el agente en marcha y aparece un botón **Aplicar y reiniciar**.

El carril izquierdo abre seis cajones:

| Cajón | Qué muestra |
|---|---|
| Equipo | Lo que lleva puesto, ranura por ranura |
| Bolsa | Lo que carga, y qué objetos puede vender o tirar el agente |
| Personalidad y memoria | El prompt propio de este personaje (editable) y lo que el agente ha anotado (solo lectura) |
| Coordenadas | Marcadores de lugares, incluido «usar posición actual» |
| Instrucciones guardadas | Órdenes de uso frecuente guardadas como botones de un clic |
| Actividad | Dos pestañas: Pensamientos (cada prompt y respuesta) y Registro (la salida del proceso del agente) |

Cada cajón se detalla en la [referencia del panel](../panel/).

**Despacho**, acoplado bajo la vista de juego, es el único control que alcanza a un agente en marcha: escribe una instrucción y llega como el siguiente turno del personaje, **en la medida de lo posible: no hay garantía de que se siga.**

## Dónde viven tus claves

Las claves de API y los secretos de los perfiles de conexión se cifran con el llavero del sistema (el `safeStorage` de Electron, con AES-GCM como respaldo) y se entregan al agente como variables de entorno — **nunca se escriben en `config.toml`.** Una configuración pegada en un informe de error no lleva ninguna credencial.

## Solución de problemas

**Versión de protocolo incompatible** — el servidor se ha actualizado. Coge una compilación nueva de la [página de descargas](../download/).

**Cambié un ajuste y no pasó nada** — el agente lee su configuración una sola vez al arrancar. Pulsa **Aplicar y reiniciar** en la cabecera.

**Lo lancé desde una terminal de VS Code y nunca se abre** — VS Code es a su vez una app Electron y filtra `ELECTRON_RUN_AS_NODE=1`, arrancando el cliente como Node puro:

```bash
env -u ELECTRON_RUN_AS_NODE npm start
```

**Falta algo o está congelado en la vista de espectador** — la vista de espectador del juego automático parte de una instantánea, así que todo lo que el agente conoce pero no está siguiendo ahora aparece a medida que vuelve a la vista.
