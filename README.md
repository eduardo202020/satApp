# Papeleta Clara - satApp

Aplicacion movil construida con Expo, React Native y TypeScript para ayudar a ciudadanos a consultar, entender y actuar frente a papeletas de transito vinculadas al SAT de Lima.

La app busca convertir un proceso administrativo dificil de entender en una ruta simple:

```text
Consultar -> Entender -> Decidir -> Actuar -> Seguir
```

El foco del prototipo es la claridad para usuarios no tecnicos, especialmente personas adultas que necesitan saber rapidamente si tienen una papeleta, que significa, si aplica descuento, que riesgo existe y cual es el siguiente paso.

## Que hace actualmente

### Consulta por placa, DNI o papeleta

La pantalla de consulta permite buscar usando solo uno de estos datos:

- Placa del vehiculo.
- Codigo de infraccion o numero de papeleta.
- DNI.

Los campos estan segmentados por caracter para reducir errores de digitacion. La placa se llena como `ABC-123`, el DNI como 8 digitos y el codigo de infraccion permite escoger `G`, `L` o `M` y luego escribir numeros.

Cada card de consulta tiene una lupa en la esquina superior derecha. Cuando el dato esta completo, tocar esa lupa ejecuta la busqueda de inmediato. Tambien se puede buscar presionando `realizar` desde el teclado, sin tener que bajar hasta un boton final.

La busqueda normaliza los valores, ignora guiones y mayusculas/minusculas, y compara contra:

- placa;
- DNI asociado;
- codigo de infraccion;
- numero de papeleta;
- aliases de busqueda usados para pruebas.

Si encuentra una o mas papeletas, navega a la pantalla de resultado.

### Resultado de consulta

La pantalla de resultado muestra una lista de papeletas asociadas al dato ingresado. Cada card conserva informacion util para decidir si abrirla:

- codigo e infraccion;
- placa;
- monto;
- vencimiento o plazo;
- riesgo;
- estado general.

Cada papeleta tiene una flecha grande en la esquina inferior derecha para entrar al detalle. La pantalla ya no muestra botones inferiores de "siguiente paso", "ver detalle" o "nueva consulta"; el objetivo es que el resultado sea limpio, escaneable y orientado a seleccionar una papeleta.

### Detalle del caso

Cada papeleta tiene una vista ordenada con:

- numero y codigo de papeleta;
- infraccion;
- placa;
- monto;
- fecha de emision;
- fecha de consulta;
- plazo o vencimiento;
- lugar;
- estado;
- riesgo;
- descuento disponible o no;
- siguiente paso.

Desde esta pantalla se puede ir a:

- revisar evidencia;
- entender mi situacion;
- linea de tiempo;
- opciones y descuento.

Estas entradas se muestran como cards con icono, descripcion corta y flecha, para que cada seccion tenga una funcion clara y no parezca una lista de botones repetidos.

### Evidencia

La pantalla de evidencia muestra la fotopapeleta de prueba asociada al caso. Por ahora todos los casos demo usan el mismo asset local:

```text
assets/evidence/papeleta.gif
```

La imagen se puede pellizcar para hacer zoom y arrastrar para revisar detalles. El objetivo es cubrir el insight del desafio: antes de pagar o reclamar, el ciudadano necesita ver la foto o evidencia y entender que ocurrio.

La pantalla mantiene informacion basica de la evidencia, lugar, fecha y un boton `Regresar` que vuelve al detalle del caso.

### Entender mi situacion

`Entender mi situacion` esta pensada para usuarios no tecnicos, especialmente personas que necesitan una explicacion simple antes de decidir.

Muestra:

- "Tu caso, en simple": etapa actual, papeleta, placa, monto y riesgo.
- "Lo que esta pasando": traduccion ciudadana de la papeleta, codigo, hecho registrado y etapa.
- "Fechas y descuento": dias calendario, dias habiles, descuento del 83%, descuento menor del 67%, monto estimado y ahorro.
- "Que puede pasar si no haces nada": riesgos concretos como perder descuento, Resolucion de Sancion, cobranza coactiva, captura vehicular o retencion bancaria.
- "Que puedes hacer ahora": acciones explicadas en lenguaje simple.
- "De donde sale esta explicacion": fuentes del RAG y reglas usadas.

Consume `POST /diagnostico-claro` desde `sat-rag`. Si el backend no responde, usa resumen local para mantener la navegacion.

### Linea de tiempo

La linea de tiempo muestra la ruta PAS/PEC del procedimiento:

```text
PIT emitida -> PAS -> Resolucion de Sancion -> Sancion firme -> PEC -> Medidas cautelares
```

Su funcion no es repetir los descuentos, sino ubicar al ciudadano en la ruta del caso y mostrar que podria pasar despues si no actua.

### Descuentos

La app calcula una orientacion de descuento usando fecha de emision, fecha de consulta, codigo de infraccion y reglas cargadas en el proyecto.

Reglas consideradas:

- 83% de descuento dentro de los primeros 5 dias habiles cuando el codigo no esta excluido.
- 67% de descuento desde el sexto dia habil hasta antes de la Resolucion de Sancion, cuando corresponde.
- Codigos `M` excluidos segun las reglas extraidas del conocimiento SAT/RAG.

La pantalla de opciones muestra:

- monto base;
- ahorro estimado;
- monto a pagar;
- dias habiles transcurridos;
- cronologia de descuentos.

En la cronologia de descuentos se sombrea el tramo vigente y aparece el pill `Estado actual`, para reconocer rapidamente si el caso esta en el 83%, en el 67% o fuera del beneficio.

Las opciones se muestran como cards accionables:

- `Pagar con % de descuento` abre `https://www.sat.gob.pe/pagosenlinea/`.
- `Presentar descargo` lleva al flujo interno de preparacion de tramite.
- `Ver mas opciones` lleva al checklist del caso.

Este calculo es informativo y debe contrastarse con el expediente y canales oficiales.

### Opciones por etapa

La app puede mostrar acciones recomendadas segun la etapa del caso. Cuando el backend `sat-rag` esta disponible, estas acciones vienen de la API. Si no esta disponible, la app usa datos locales.

Ejemplos de acciones:

- pagar;
- presentar descargo;
- consultar expediente;
- presentar apelacion;
- regularizar deuda;
- consultar orden de captura.

### Consulta por voz

La app incluye una consulta por voz con una experiencia similar a una nota de voz:

- boton de microfono;
- contador de tiempo;
- onda dinamica que responde al volumen de entrada;
- pausa;
- cancelar con papelera;
- enviar consulta;
- transcripcion a texto.

Esta funcionalidad usa `expo-speech-recognition`, por lo que necesita un development build o APK nativo. No funciona sobre Expo Go estandar.

La transcripcion se usa para detectar intenciones basicas como descuento, pago o riesgo, y puede navegar hacia el caso detectado.

### Drawer, perfil y canales

El drawer fue simplificado para reducir ruido:

- Papeleta Clara.
- Perfil.
- Canales oficiales SAT.
- WhatSAT.

La seccion de perfil prepara el flujo para validacion de identidad, preferencias y seguridad. WhatSAT abre WhatsApp hacia el canal configurado para consultas externas.

### Alertas

La app tiene pantallas de alertas y configuracion de recordatorios. El objetivo es avisar al usuario sobre vencimientos, riesgos o cambios relevantes.

### Deep links

La app declara el esquema:

```text
satapp://
```

Existe una ruta para abrir una papeleta desde un enlace:

```text
satapp://papeleta/<id>
```

La ruta redirige internamente al detalle del caso:

```text
/caso/<id>
```

Esto deja preparada la app para un escenario futuro donde un mensaje de WhatsApp, SMS o una web externa pueda abrir directamente un caso en la app.

## Relacion con sat-rag

`satApp` consume informacion del proyecto hermano `sat-rag` cuando se configura:

```bash
EXPO_PUBLIC_SAT_API_URL=http://IP_DE_TU_PC:8000
```

La app usa dos hooks principales:

- `useCases`: carga `/cases` desde `sat-rag`; si falla, usa datos locales.
- `useCaseJourney`: carga `/cases/:id`; si falla, usa una ruta local.

La API entrega:

- casos;
- etapa actual;
- riesgo;
- timeline;
- opciones disponibles;
- checklist;
- canal oficial recomendado;
- evidencia;
- explicacion para "Entender mi situacion".

## Datos de prueba

Con backend `sat-rag`, los casos principales son:

| Placa | Codigo | Caso | Situacion |
|---|---|---|---|
| `DEM001` | `G11` | `demo-g11-descuento` | Emitida ayer, descuento del 83% |
| `DEM002` | `G27` | `demo-g27-plazo-proximo` | Emitida hace 5 dias, plazo inicial |
| `DEM003` | `M03` | `demo-m03-sancion-firme` | Emitida hace 10 dias, sancion firme |
| `DEM005` | `G27` | `demo-g27-segunda-ventana` | Emitida hace 10 dias, descuento menor del 67% |
| `DEM004` | `M42` | `demo-m42-riesgo-coactivo` | Emitida hace 10 dias, REC/coactiva |

En modo local, la app tambien acepta aliases para facilitar pruebas:

| Dato | Resultado esperado |
|---|---|
| `DEM001` | Caso G11 |
| `DEM002` | Caso G27 inicial |
| `DEM003` | Caso M03 |
| `DEM004` | Caso M42 |
| `DEM005` | Caso G27 con descuento menor |
| `ABC123` o `ABC-123` | Caso G11 |
| `G11` o `G11125456` | Caso G11 |
| `45678901` | Casos asociados a ese DNI |
| `SAT202` o `M20078901` | Caso M20 local |
| `LIM046` o `G46654321` | Caso G46 local |

## Estructura

```text
app/
  (drawer)/
    (tabs)/
      inicio/
      casos/
    perfil/
  alertas/
  caso/[id]/
  papeleta/[id].tsx

src/
  features/
    alerts/
    cases/
    profile/
    ruta-clara/
    voice/
  shared/
    api/
    components/
    data/
    navigation/
    styles/
    types/
```

La navegacion usa Expo Router con rutas basadas en carpetas. La logica esta separada por funcionalidades dentro de `src/features`.

## Stack tecnico

- Expo SDK 54.
- React Native 0.81.
- React 19.
- TypeScript.
- Expo Router.
- React Navigation Drawer.
- Expo Dev Client.
- Expo Speech Recognition.
- EAS Build.

## Desarrollo local

Instalar dependencias:

```bash
npm install
```

Verificar TypeScript:

```bash
npm run typecheck
```

Iniciar Metro para una app instalada como development build:

```bash
npm run start:dev:tunnel -- --clear
```

En WSL2 y telefono fisico, el modo tunnel suele ser el mas estable. Si se usa `sat-rag`, la URL del API debe ser accesible desde el telefono; no usar `127.0.0.1` en el celular.

## Builds

Development build para desarrollo:

```bash
npx eas build --platform android --profile development
```

Preview APK para compartir:

```bash
npx eas build --platform android --profile preview
```

Despues de instalar un development build, los cambios de JavaScript, TypeScript y estilos pueden probarse con Metro sin generar un APK nuevo.

Requieren nuevo build:

- cambios en librerias nativas;
- permisos;
- plugins de Expo;
- icono;
- splash;
- configuracion nativa de Android/iOS.

## Variables de entorno

Ejemplo:

```bash
EXPO_PUBLIC_SAT_API_URL=http://192.168.1.50:8000
```

Si la variable no esta configurada o el API no responde, la app mantiene datos locales para que el flujo siga funcionando.

## Privacidad y alcance

El prototipo no debe usar datos personales reales durante pruebas. Los casos actuales son datos de prueba para validar experiencia, navegacion y decisiones.

La app no reemplaza los canales oficiales del SAT ni constituye asesoria legal. Su objetivo es ordenar informacion, mostrar rutas posibles y guiar al usuario hacia acciones verificables.

## Estado actual y siguientes mejoras

Ya existe:

- consulta por placa, DNI y papeleta;
- entrada guiada por caracteres;
- lupa accionable por card de consulta;
- busqueda con `realizar` desde el teclado;
- busqueda con aliases;
- resultado como lista de papeletas con flecha a detalle;
- detalle del caso;
- evidencia con fotopapeleta, pinch zoom y arrastre;
- entender mi situacion con explicacion ciudadana desde `sat-rag`;
- linea de tiempo PAS/PEC;
- calculo orientativo de descuentos;
- cronologia de descuentos con `Estado actual`;
- opciones accionables para pago, descargo y checklist;
- voz con transcripcion;
- rutas profundas;
- integracion inicial con `sat-rag`;
- fallback local sin backend;
- drawer y perfil simplificados.

Pendiente recomendado:

- hacer interactivo el checklist y guardar avances del usuario;
- simular pago, apelacion y regularizacion ademas del descargo;
- conectar expediente y canales oficiales con URLs finales verificadas;
- generar alertas locales desde reglas de plazo;
- validar reglas legales vigentes antes de produccion;
- endurecer privacidad, consentimiento y manejo de datos reales;
- mejorar persistencia de usuario y casos reales cuando exista integracion oficial.
