# SatApp

Aplicacion movil construida con Expo, React Native y TypeScript para ayudar a ciudadanos a consultar, entender y gestionar papeletas de transito asociadas al SAT de Lima.

El objetivo del prototipo es convertir un proceso confuso en una ruta simple:

```text
Consultar -> Entender -> Revisar fechas -> Decidir -> Actuar -> Seguir
```

La app esta pensada para usuarios no tecnicos, incluyendo personas adultas y adultos mayores. Por eso prioriza textos cortos, botones grandes, navegacion visible, lectura por voz y flujos guiados.

## Estado actual

### Navegacion principal

La navegacion inferior tiene tres accesos:

- `Casos`: lista de papeletas asociadas o registradas.
- `Inicio`: punto de partida para consultar, usar voz o abrir un flujo.
- `Ayuda`: guia simple para aprender a usar la app.

El drawer queda como acceso secundario para perfil, canales SAT y WhatSAT.

### Consulta

La consulta permite buscar usando solo uno de estos datos:

- placa del vehiculo;
- numero o codigo de papeleta;
- DNI.

Los campos se llenan por caracteres para reducir errores. La placa se guia como `ABC-123`, el DNI tiene 8 digitos y el codigo de papeleta permite escoger tipo `G`, `L` o `M` y luego ingresar numeros.

Si no hay papeletas asociadas al dato consultado, la app ofrece `Registrar papeleta` para casos donde el usuario ya tiene el documento fisico, pero el SAT aun no lo procesa.

### Registro manual de papeleta

La pantalla `Registrar papeleta` permite:

- ingresar placa, papeleta y DNI con los mismos inputs guiados de consulta;
- seleccionar fecha desde calendario;
- ingresar monto estimado;
- adjuntar foto real de la papeleta desde la galeria;
- crear un caso preliminar para seguimiento.

El registro manual se mantiene en memoria durante la sesion del prototipo. Para una version productiva debe persistirse en almacenamiento local o backend.

### Detalle del caso

Cada papeleta tiene una pantalla de detalle con datos basicos:

- codigo y numero;
- infraccion;
- placa;
- monto;
- fecha de emision;
- estado;
- riesgo;
- siguiente paso sugerido.

Desde el detalle se accede a cuatro pantallas con responsabilidades separadas:

- `Revisar evidencia`: ver foto o evidencia.
- `Entender mi situacion`: explicar por que se genero la papeleta.
- `Linea de tiempo`: analizar descuentos por fechas y dias habiles.
- `Opciones y descuento`: elegir que hacer.

### Entender mi situacion

Esta pantalla ya no repite pagos ni cronologias. Su funcion es explicar la papeleta en lenguaje ciudadano:

- que significa la infraccion;
- por que pudo haberse generado;
- que datos revisar antes de decidir;
- codigo, placa e infraccion del caso.

Incluye un boton `Escuchar explicacion` usando `expo-speech`, para que el usuario pueda oir la orientacion en voz alta.

Si `sat-rag` esta disponible, puede complementar con una explicacion desde `POST /diagnostico-claro`. Si no responde, la pantalla sigue funcionando con una guia local.

### Linea de tiempo

La pantalla `Linea de tiempo` se centra en fechas y descuentos. Muestra:

- fecha de emision;
- fecha de consulta;
- dias habiles transcurridos;
- calendario mensual con colores;
- tramo de 83%;
- tramo de 67%;
- fines de semana marcados como dias no habiles;
- boton/card para pagar con beneficio cuando corresponde.

Esta pantalla evita repetir acciones o explicaciones largas. Su objetivo es que el usuario entienda visualmente los plazos.

### Opciones y descuento

La pantalla `Opciones y descuento` muestra lo necesario para decidir:

- si hay beneficio vigente;
- monto base;
- ahorro estimado;
- monto estimado a pagar;
- acciones disponibles.

El pago ya no abre un navegador. Ahora navega a un flujo interno de pago.

### Flujo de pago

La ruta `/caso/[id]/pago` simula gestion de pago dentro de la app:

- seleccion de metodo de pago;
- Yape como metodo funcional del prototipo;
- ingreso de numero de celular;
- ingreso de codigo de aprobacion;
- loading de procesamiento;
- pantalla de exito con numero de orden y total.

Los otros metodos aparecen deshabilitados para mostrar enfoque futuro.

### Preparar descargo

La pantalla `Preparar descargo` permite:

- marcar checklist obligatorio;
- escribir explicacion del usuario;
- adjuntar sustento real con `expo-document-picker`;
- subir multiples archivos;
- aceptar fotos, PDF y documentos;
- quitar adjuntos antes de registrar.

El backend simula la constancia cuando se envia la accion.

### Evidencia

La pantalla de evidencia muestra la fotopapeleta de prueba asociada al caso. Permite revisar la imagen con zoom y desplazamiento. Por ahora usa un asset local de demostracion:

```text
assets/evidence/papeleta.gif
```

### Ayuda inclusiva

El tab `Ayuda` explica:

- para que sirve cada tab;
- flujo recomendado de uso;
- consulta;
- entendimiento de la infraccion;
- linea de tiempo;
- pago o descargo.

Incluye `Escuchar guia` con `expo-speech`, pensado para usuarios que prefieren audio o tienen dificultad leyendo textos largos.

### Consulta por voz

La consulta por voz usa `expo-speech-recognition` con una experiencia similar a una nota de voz:

- microfono;
- contador;
- onda dinamica;
- pausar;
- cancelar;
- enviar;
- transcripcion.

La transcripcion se usa para detectar intenciones basicas y navegar hacia el flujo adecuado.

### Deep links

La app declara el esquema:

```text
satapp://
```

Existe una ruta para abrir una papeleta desde enlace externo:

```text
satapp://papeleta/<id>
```

Internamente redirige a:

```text
/caso/<id>
```

Esto deja preparada una integracion futura con WhatsApp, SMS o una web externa.

## Relacion con sat-rag

La app puede consumir el backend `sat-rag` mediante:

```bash
EXPO_PUBLIC_SAT_API_URL=http://IP_DE_TU_PC:8000
```

Importante: en un telefono fisico no usar `127.0.0.1`, porque apunta al propio telefono. Usa la IP LAN de la PC/WSL o una URL publica.

La app consume principalmente:

- `GET /cases`
- `GET /cases/{case_id}`
- `GET /cases/{case_id}/tracking`
- `POST /cases/{case_id}/actions`
- `POST /diagnostico-claro`

Si el backend no esta disponible, la app conserva datos locales para que la demo siga navegable.

## Datos de prueba locales

Casos locales utiles:

| Dato | Resultado esperado |
|---|---|
| `ABC123` o `ABC-123` | Caso G11 |
| `G11` o `G11125456` | Caso G11 |
| `45678901` | Casos asociados a ese DNI |
| `SAT202` o `M20078901` | Caso M20 |
| `LIM046` o `G46654321` | Caso G46 |

Datos del backend `sat-rag`:

| Placa | Codigo | Caso |
|---|---|---|
| `DEM001` | `G11` | `demo-g11-descuento` |
| `DEM002` | `G27` | `demo-g27-plazo-proximo` |
| `DEM003` | `M03` | `demo-m03-sancion-firme` |
| `DEM005` | `G27` | `demo-g27-segunda-ventana` |
| `DEM004` | `M42` | `demo-m42-riesgo-coactivo` |

## Estructura

```text
app/
  (drawer)/
    (tabs)/
      casos/
      inicio/
      ayuda/
    perfil/
  alertas/
  caso/[id]/
  papeleta/[id].tsx

src/
  features/
    alerts/
    cases/
    help/
    profile/
    ruta-clara/
    voice/
  shared/
    api/
    components/
    data/
    hooks/
    navigation/
    styles/
    types/
```

## Stack tecnico

- Expo SDK 54.
- React Native 0.81.
- React 19.
- TypeScript.
- Expo Router.
- React Navigation Drawer.
- Expo Dev Client.
- EAS Build.
- `expo-speech-recognition` para consulta por voz.
- `expo-speech` para lectura en voz alta.
- `expo-image-picker` para foto de papeleta.
- `expo-document-picker` para sustento de descargo.
- `expo-splash-screen` para splash/icono.

## Desarrollo local

Instalar dependencias:

```bash
npm install
```

Verificar TypeScript:

```bash
npm run typecheck
```

Iniciar Metro para development build:

```bash
npm run start:dev:tunnel -- --clear
```

En WSL2 con telefono fisico, el modo tunnel suele ser el mas estable.

## Builds

APK con development client para seguir desarrollando:

```bash
npx eas build --platform android --profile development
```

APK preview para compartir:

```bash
npx eas build --platform android --profile preview
```

Despues de instalar un development build, los cambios JS/TS/estilos pueden verse con Metro sin generar otro APK.

Requieren nuevo build:

- nuevas librerias nativas;
- permisos;
- plugins Expo;
- icono;
- splash;
- configuracion Android/iOS.

## Privacidad y alcance

El prototipo usa datos ficticios. No debe usarse con datos personales reales sin consentimiento, controles de seguridad y validacion legal.

La app no reemplaza canales oficiales del SAT ni constituye asesoria legal. Su objetivo es orientar, ordenar informacion y ayudar a decidir el siguiente paso.

## Siguientes mejoras recomendadas

- Persistir registros manuales y preferencias.
- Mejorar autenticacion/perfil.
- Conectar pagos reales solo con proveedor autorizado.
- Agregar recordatorios locales por fecha.
- Integrar feriados para computo de dias habiles.
- Robustecer privacidad antes de usar datos reales.
- Convertir la ayuda en onboarding/tour guiado si el alcance lo permite.
