# Papeleta Clara

Papeleta Clara es una aplicación móvil construida con Expo y React Native para ayudar a ciudadanos a entender, seguir y actuar frente a papeletas de tránsito administradas por el SAT de Lima.

La app está pensada como un copiloto ciudadano: convierte información legal, plazos, estados y canales oficiales en una ruta clara, visual y accionable. El prototipo usa datos ficticios y no almacena datos personales reales.

## Propósito

El objetivo principal es guiar al usuario en una secuencia simple:

```text
Detectar -> Comprender -> Decidir -> Actuar -> Seguir
```

En lugar de mostrar solo información suelta, la app organiza cada caso en pasos comprensibles: qué ocurrió, en qué etapa está, qué riesgo tiene, qué opciones existen y qué canal oficial corresponde.

## Funcionalidades Principales

### Inicio y Ruta Clara

La pantalla principal presenta accesos directos para:

- Consultar una papeleta.
- Probar un caso ficticio.
- Hablar con Papeleta Clara mediante voz.
- Entender una papeleta.
- Revisar descuentos disponibles.
- Revisar riesgos de captura o retención.

Cada opción lleva a una pantalla concreta y mantiene el lenguaje simple para usuarios no técnicos.

### Consulta por Voz

La app incluye una experiencia de consulta por voz inspirada en la interacción de notas de voz de WhatsApp, pero adaptada al estilo visual de Papeleta Clara.

El usuario puede:

- Iniciar una consulta tocando el micrófono.
- Ver un contador mientras habla.
- Ver una onda dinámica que responde al volumen real del micrófono.
- Pausar la escucha.
- Reanudar la escucha.
- Cancelar con papelera.
- Enviar la consulta transcrita.
- Ver la transcripción reconocida.
- Procesar localmente intenciones básicas, como descuento, riesgo o pago.

La transcripción usa `expo-speech-recognition`, por lo que requiere un build nativo o development build. No funciona en Expo Go estándar.

### Casos Ficticios

El prototipo trabaja con casos demo completamente ficticios, por ejemplo:

- Papeleta en plazo inicial.
- Papeleta con riesgo bajo.
- Papeleta con sanción firme.
- Papeleta en seguimiento.

Estos casos permiten demostrar el flujo sin usar datos personales reales.

### Detalle del Caso

Cada caso muestra información ordenada:

- Código de papeleta.
- Infracción.
- Placa ficticia.
- Monto.
- Fecha de emisión.
- Lugar.
- Riesgo.
- Estado.
- Siguiente paso recomendado.

También se incluyen pantallas de opciones, línea de tiempo, checklist y canal oficial.

### Alertas

La app incluye un centro de alertas para mostrar recordatorios importantes, vencimientos o riesgos. Está pensado para que el usuario no pierda plazos relevantes.

### Perfil

El drawer incluye una sección de perfil con:

- Resumen del usuario ficticio.
- Validación de identidad.
- Preferencias.
- Seguridad.

El objetivo es preparar el flujo para escenarios donde algunas acciones requieran validación antes de mostrar información sensible.

### Drawer Simplificado

El menú lateral fue simplificado para mantener la app enfocada:

- Papeleta Clara.
- Perfil.
- Canales oficiales SAT.
- WhatSAT.

WhatSAT abre el canal de WhatsApp del SAT para consultas oficiales.

## Integración RAG Planeada

El proyecto incluye documentación en `rag.md` para conectar una base de conocimiento SAT/RAG ya procesada.

La arquitectura propuesta separa dos tipos de información:

### Datos Determinísticos

Estos datos deben usarse para decisiones que no deben depender de un modelo generativo:

- Plazos.
- Descuentos.
- Etapas.
- Riesgos.
- Canales oficiales.
- Glosario.
- Casos demo.
- Códigos de infracción.

### Corpus RAG

El RAG se utilizaría para explicar información con fuentes, recuperar contexto normativo y redactar respuestas en lenguaje ciudadano.

El endpoint conceptual principal es:

```http
POST /diagnostico-claro
```

Ejemplo de payload:

```json
{
  "caseId": "demo-g11-plazo-inicial",
  "userNarrativeTranscript": "Tengo la papeleta G11 y quiero saber si tengo descuento",
  "queryDate": "2026-06-13"
}
```

La respuesta esperada debería alimentar una pantalla de diagnóstico con:

- Resumen del caso.
- Etapa detectada.
- Riesgo.
- Opciones disponibles.
- Próximos pasos.
- Canal oficial recomendado.
- Fuentes consultadas.
- Disclaimer.

La información RAG es orientativa y debe incluir fuentes y advertencia. No reemplaza la revisión del expediente ni los canales oficiales del SAT.

## Privacidad

El prototipo está diseñado bajo un enfoque conservador:

- No usa datos personales reales.
- No almacena audios.
- No almacena DNI, placas reales ni expedientes reales.
- La voz se usa para transcribir la consulta en la app.
- Cualquier integración futura con backend debe evitar enviar datos personales sin consentimiento.

## Stack Técnico

- Expo SDK 54.
- React Native 0.81.
- React 19.
- TypeScript.
- Expo Router.
- React Navigation Drawer.
- `expo-speech-recognition`.
- `expo-dev-client`.
- EAS Build para APK preview y development builds.

## Estructura del Proyecto

```text
app/
  (drawer)/
    (tabs)/
      inicio/
      casos/
    perfil/
  alertas/
  caso/

src/
  features/
    alerts/
    cases/
    info/
    profile/
    ruta-clara/
    voice/
  navigation/
  shared/
```

La app usa rutas basadas en carpetas mediante Expo Router y separa pantallas por funcionalidades dentro de `src/features`.

## Desarrollo Local

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

Este comando se usa con una app instalada como development build en el celular.

## Builds

### Development Build

Se usa para desarrollo diario sin reconstruir en cada cambio de interfaz:

```bash
npx eas build --platform android --profile development
```

Una vez instalado ese APK, los cambios de JS/TS/UI se prueban con Metro.

### Preview APK

Se usa para entregar una versión instalable:

```bash
npx eas build --platform android --profile preview
```

## Cuándo Requiere Nuevo Build

No se necesita nuevo build para cambios normales de interfaz, estilos o lógica JavaScript/TypeScript si se usa development build.

Sí se necesita nuevo build cuando se cambia:

- Una librería nativa.
- Permisos en `app.json`.
- Plugins de Expo.
- Icono o splash.
- Package name o configuración nativa.
- Dependencias que requieren código nativo.

## Estado del Prototipo

La app ya cuenta con:

- Navegación principal con tabs y drawer.
- Pantallas de caso y alertas.
- Perfil.
- Consulta por voz funcional en APK nativo.
- Onda dinámica basada en volumen real.
- Configuración EAS.
- Documentación RAG preparada para una futura integración.

## Advertencia

Papeleta Clara es un prototipo informativo. Las respuestas, rutas y recomendaciones no constituyen asesoría legal definitiva. El usuario debe verificar su expediente y utilizar canales oficiales del SAT para confirmar información y realizar trámites.
