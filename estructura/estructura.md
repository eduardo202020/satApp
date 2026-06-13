Sí, Dante. La idea correcta sería:

> **Tab Inicio = entrada al Stack Ruta Clara**
> **Tab Mis casos = entrada al Stack de Seguimiento de Casos**

Pero hay un detalle importante: **no conviene duplicar pantallas**. El detalle de un caso, timeline, opciones y checklist pueden ser usados tanto desde Inicio como desde Mis casos.

---

# 1. Tab Inicio

## Función

Inicio sirve para empezar una nueva ruta.

Aquí vive el flujo:

```text
Inicio
→ Consulta
→ Resultado
→ Detalle del caso
→ Timeline
→ Opciones
→ Checklist
→ Canal oficial
→ Confirmación
```

Este es el **Stack Ruta Clara**.

## Objetivo del stack

Guiar al ciudadano desde cero:

```text
Detectar → Comprender → Decidir → Actuar → Seguir
```

Ejemplo:

```text
Inicio
↓
“Consultar mi papeleta”
↓
Consulta por placa o caso ficticio
↓
Resultado
↓
Ver Ruta Clara
↓
Detalle del caso
↓
Línea de tiempo
↓
Opciones
↓
Checklist
↓
Canal oficial SAT
```

---

# 2. Tab Mis casos

## Función

Mis casos no inicia desde cero. Sirve para que el usuario vuelva a casos ya consultados o guardados.

Aquí vive un stack distinto:

```text
Mis casos
→ Detalle del caso guardado
→ Seguimiento
→ Timeline
→ Opciones pendientes
→ Checklist pendiente
→ Alertas del caso
```

Lo llamaría:

## **Stack Seguimiento de Casos**

---

# 3. Diferencia entre ambos tabs

| Tab           | Qué hace                                 | Stack                 |
| ------------- | ---------------------------------------- | --------------------- |
| **Inicio**    | Empieza una nueva consulta o ruta guiada | **Ruta Clara Stack**  |
| **Mis casos** | Retoma casos ya consultados o guardados  | **Seguimiento Stack** |

La diferencia es esta:

```text
Inicio = “quiero empezar”
Mis casos = “quiero continuar o revisar”
```

---

# 4. Cómo se vería en Expo Router

Una estructura clara sería:

```text
app/
│
├── _layout.tsx
│
├── (drawer)/
│   ├── _layout.tsx
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   │
│   │   ├── inicio/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── consulta.tsx
│   │   │   ├── resultado.tsx
│   │   │   └── confirmacion.tsx
│   │   │
│   │   └── casos/
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       ├── seguimiento.tsx
│   │       └── alertas-caso.tsx
│   │
│   ├── ayuda.tsx
│   ├── canales-sat.tsx
│   ├── fuentes.tsx
│   ├── datos-abiertos.tsx
│   ├── privacidad.tsx
│   └── acerca.tsx
│
├── caso/
│   ├── [id]/
│   │   ├── index.tsx
│   │   ├── timeline.tsx
│   │   ├── opciones.tsx
│   │   ├── checklist.tsx
│   │   └── canal-oficial.tsx
│
└── alertas/
    ├── index.tsx
    ├── [id].tsx
    └── configurar.tsx
```

---

# 5. Por qué pongo `caso/[id]` fuera de tabs

Porque el detalle de un caso se puede abrir desde dos lugares:

```text
Inicio → Resultado → Caso
Mis casos → Caso
Campanita → Alerta → Caso
```

Entonces, en vez de duplicar:

```text
inicio/caso
casos/caso
alertas/caso
```

mejor tienes una ruta compartida:

```text
caso/[id]
```

Así el mismo detalle sirve para todo.

---

# 6. Stack de Inicio

Dentro de `tabs/inicio` iría:

```text
inicio/index
→ inicio/consulta
→ inicio/resultado
→ caso/[id]
→ caso/[id]/timeline
→ caso/[id]/opciones
→ caso/[id]/checklist
→ caso/[id]/canal-oficial
→ inicio/confirmacion
```

## Pantalla inicial de Inicio

```text
¿Qué necesitas hacer hoy?

[Consultar mi papeleta]
[Probar caso ficticio]
[Entender una papeleta]
[Ver si tengo descuento]
[Revisar riesgo de captura o retención]
```

---

# 7. Stack de Mis casos

Dentro de `tabs/casos` iría:

```text
casos/index
→ caso/[id]
→ caso/[id]/timeline
→ caso/[id]/opciones
→ caso/[id]/checklist
→ casos/seguimiento
→ casos/alertas-caso
```

## Pantalla inicial de Mis casos

```text
Mis casos

Caso G11
Estado: En plazo inicial
Riesgo: Bajo
[Ver ruta clara]

Caso M20
Estado: Riesgo coactivo
Riesgo: Alto
[Ver ruta clara]
```

---

# 8. Campanita de alertas

La campanita no pertenece a un tab. Es global.

```text
Header campanita
→ alertas/index
→ alertas/[id]
→ caso/[id]
```

Ejemplo:

```text
Tocas campanita
↓
“Tu papeleta G11 vence mañana”
↓
Ver alerta
↓
Ver caso relacionado
↓
Caso/[id]
```

---

# 9. Drawer

El drawer tampoco debe contener el flujo principal.

Debe ser secundario:

```text
Drawer
├── Ayuda
├── Canales oficiales SAT
├── Fuentes oficiales
├── Datos abiertos
├── Privacidad
└── Acerca del prototipo
```

---

# 10. Resumen final

Tu navegación final debería quedar así:

```text
Tabs visibles:
1. Inicio
2. Mis casos

Inicio:
- Stack Ruta Clara para iniciar una nueva consulta.

Mis casos:
- Stack Seguimiento para retomar casos guardados.

Caso/[id]:
- Ruta compartida para detalle, timeline, opciones y checklist.

Alertas:
- Stack global abierto desde la campanita.

Drawer:
- Información secundaria y soporte.
```

La lógica queda limpia:

> **Inicio empieza una ruta.
> Mis casos continúa una ruta.
> La campanita avisa una urgencia.
> El drawer guarda lo complementario.**
