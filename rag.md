# Papeleta Clara - Base de conocimiento SAT/RAG

## Descripción

Este repositorio contiene una base de conocimiento procesada para **Papeleta Clara**, un
copiloto ciudadano orientado a explicar, seguir y resolver papeletas de tránsito administradas
por el SAT de Lima.

El proyecto transforma documentos PDF, páginas institucionales y archivos Markdown en:

- documentos Markdown limpios;
- chunks preparados para Retrieval-Augmented Generation (RAG);
- reglas determinísticas en JSON;
- casos ficticios para demostración;
- metadatos de fuentes y reportes de calidad.

El objetivo es que una aplicación móvil o web pueda guiar al ciudadano mediante la ruta:

> Detectar -> Comprender -> Decidir -> Actuar -> Seguir

La información generada es orientativa. No reemplaza la revisión del expediente, la normativa
vigente ni los canales oficiales del SAT.

## Estado actual

- Fuentes procesadas: **14 archivos**.
- Fuentes únicas: **13**.
- Chunks RAG: **415**.
- PDFs recuperados mediante OCR: **5**.
- Casos demo: **4**, sin datos personales reales.
- Tabla de infracciones: subconjunto parcial que requiere validación manual.

Los detalles se encuentran en:

- `knowledge/reports/processing-report.md`
- `knowledge/reports/ocr-lmstudio-report.md`
- `knowledge/structured/manual-review.json`

## Estructura del repositorio

```text
sat-rag/
  rag/                         # Documentos originales
  knowledge/
    raw/                       # Copias y extracciones crudas/OCR
    clean/                     # Documentos Markdown limpios
    structured/                # Manifiesto y asuntos para revisión
    chunks/
      rag_chunks.jsonl         # Corpus preparado para RAG
    reports/                   # Reportes de procesamiento y OCR
  app/data/
    codigos-infraccion.json    # Subconjunto estructurado de infracciones
    reglas-plazos.json         # Descuentos, plazos y reglas de riesgo
    flujo-pit.json             # Etapas del procedimiento PAS/PEC
    canales-sat.json           # Canales oficiales por acción ciudadana
    casos-demo.json            # Casos totalmente ficticios
    glosario.json              # Definiciones en lenguaje simple
    fuentes-oficiales.json     # Índice de fuentes
  lib/knowledge/               # Utilidades TypeScript para Expo/React Native
  scripts/
    process_knowledge.py       # Generador principal
    ocr_with_lmstudio.py       # OCR y revisión local mediante LM Studio
```

## Dos tipos de datos

### Datos estructurados y determinísticos

Los archivos de `app/data/` deben utilizarse para decisiones que no deben depender de un LLM:

- determinar etapas;
- mostrar plazos conocidos;
- identificar descuentos y exclusiones;
- elegir canales oficiales;
- mostrar acciones y CTA;
- consultar glosario, infracciones y casos demo.

Nunca se debe pedir al LLM que invente o calcule estas reglas.

### Corpus RAG

`knowledge/chunks/rag_chunks.jsonl` contiene una línea JSON por chunk:

```json
{
  "id": "chunk_0001",
  "title": "Ruta de la papeleta de infracción de tránsito",
  "text": "...",
  "source_file": "01 - RUTA DEL PAPELETA DE INFRACCIÓN DE TRÁNSITO.pdf",
  "source_url": null,
  "topic": "ruta_pit",
  "section": "Página 1",
  "page": 1,
  "tags": ["plazos", "descargo"],
  "priority": "high"
}
```

Los chunks sirven para recuperar contexto y redactar explicaciones. La respuesta final siempre
debe incluir fuentes y un disclaimer.

## Regenerar la base de conocimiento

Requisitos:

- Windows y PowerShell;
- Python 3.11 o posterior;
- `pdftotext`, `pdfinfo` y `pdftoppm`;
- Tesseract OCR para regenerar los PDFs escaneados;
- LM Studio en `http://127.0.0.1:1234` para revisar OCR.

### Procesamiento normal

Cuando los archivos de `rag/` ya tienen texto u OCR generado:

```powershell
cd C:\Users\pc\Documents\proyectos\sat-rag
python scripts\process_knowledge.py
```

Este comando regenera los documentos limpios, chunks, JSON y reportes principales.

### Repetir OCR

El script espera que LM Studio tenga cargado el identificador `qwen-ocr-review`:

```powershell
lms load qwen2.5-7b-instruct `
  --gpu max `
  --context-length 16384 `
  --parallel 1 `
  --identifier qwen-ocr-review `
  --yes

python scripts\ocr_with_lmstudio.py
python scripts\process_knowledge.py
```

El OCR conserva el texto crudo. LM Studio solamente revisa su calidad y señala páginas que
deben contrastarse con el PDF original.

## Servir el conocimiento mediante FastAPI

La API puede comenzar sin una base de datos externa: carga los JSON y `rag_chunks.jsonl` al
iniciar el proceso. Esta opción es suficiente para un MVP o una hackatón.

### Crear el entorno

```powershell
cd C:\Users\pc\Documents\proyectos\sat-rag
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi "uvicorn[standard]" pydantic
```

Dependencias opcionales según la integración:

```powershell
# Cliente de LM Studio/OpenAI compatible
pip install openai

# SQLite asíncrono y SQLAlchemy
pip install sqlalchemy aiosqlite

# PostgreSQL y pgvector
pip install "psycopg[binary]" pgvector sqlalchemy
```

### Implementación mínima

Crear `api/main.py` con una implementación equivalente a:

```python
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Query


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "app" / "data"
CHUNKS_PATH = ROOT / "knowledge" / "chunks" / "rag_chunks.jsonl"


def load_json(name: str) -> Any:
    return json.loads((DATA_DIR / name).read_text(encoding="utf-8"))


def load_chunks() -> list[dict[str, Any]]:
    return [
        json.loads(line)
        for line in CHUNKS_PATH.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


infractions = load_json("codigos-infraccion.json")
flow = load_json("flujo-pit.json")
rules = load_json("reglas-plazos.json")
channels = load_json("canales-sat.json")
cases = load_json("casos-demo.json")
glossary = load_json("glosario.json")
sources = load_json("fuentes-oficiales.json")
chunks = load_chunks()

app = FastAPI(
    title="Papeleta Clara Knowledge API",
    version="1.0.0",
    description="API informativa para consultar reglas determinísticas y contexto RAG.",
)


def normalize_code(code: str) -> str:
    code = "".join(char for char in code.upper() if char.isalnum())
    if len(code) >= 2 and code[0] in "MGL" and code[1:].isdigit():
        return f"{code[0]}{int(code[1:]):02d}"
    return code


@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "chunks": len(chunks), "sources": len(sources)}


@app.get("/infractions/{code}")
def get_infraction(code: str) -> dict[str, Any]:
    normalized = normalize_code(code)
    item = next((row for row in infractions if row["codigo"] == normalized), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Código no encontrado")
    return item


@app.get("/stages/{stage_id}")
def get_stage(stage_id: str) -> dict[str, Any]:
    item = next((row for row in flow["stages"] if row["id"] == stage_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Etapa no encontrada")
    return item


@app.get("/cases/{case_id}")
def get_case(case_id: str) -> dict[str, Any]:
    item = next((row for row in cases if row["id"] == case_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Caso no encontrado")
    return item


@app.get("/channels")
def get_channels(action: str | None = None) -> list[dict[str, Any]]:
    if not action:
        return channels
    return [
        channel
        for channel in channels
        if action in channel["recommended_for_actions"]
    ]


@app.get("/glossary/{term}")
def get_glossary_term(term: str) -> dict[str, Any]:
    normalized = term.casefold()
    item = next((row for row in glossary if row["term"].casefold() == normalized), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Término no encontrado")
    return item


@app.get("/rules")
def get_rules() -> dict[str, Any]:
    return rules


@app.get("/rag/search")
def search_chunks(
    q: str = Query(min_length=2),
    topic: str | None = None,
    limit: int = Query(default=5, ge=1, le=20),
) -> list[dict[str, Any]]:
    terms = q.casefold().split()
    candidates = chunks if topic is None else [
        chunk for chunk in chunks if chunk["topic"] == topic
    ]

    ranked = []
    for chunk in candidates:
        searchable = f'{chunk["title"]} {chunk["text"]} {" ".join(chunk["tags"])}'.casefold()
        score = sum(searchable.count(term) for term in terms)
        if score:
            ranked.append((score, chunk))

    ranked.sort(key=lambda item: item[0], reverse=True)
    return [{**chunk, "score": score} for score, chunk in ranked[:limit]]
```

### Ejecutar FastAPI

```powershell
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

Interfaces disponibles:

- API: `http://localhost:8000`
- Swagger/OpenAPI: `http://localhost:8000/docs`
- Esquema OpenAPI: `http://localhost:8000/openapi.json`

Para consumir la API desde Expo/React Native en otro dispositivo de la red, se debe utilizar
la IP local de la computadora en lugar de `localhost` y configurar CORS explícitamente para
los orígenes permitidos.

Pruebas rápidas:

```powershell
Invoke-RestMethod http://localhost:8000/health
Invoke-RestMethod http://localhost:8000/infractions/G11
Invoke-RestMethod http://localhost:8000/stages/plazo_inicial_5_dias
Invoke-RestMethod "http://localhost:8000/rag/search?q=medida%20cautelar&limit=3"
```

## Endpoints recomendados

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/health` | Estado de la API |
| `GET` | `/infractions/{code}` | Consultar un código normalizado |
| `GET` | `/stages/{stage_id}` | Consultar una etapa PAS/PEC |
| `GET` | `/cases/{case_id}` | Obtener un caso demo |
| `GET` | `/channels?action=...` | Obtener canales oficiales para una acción |
| `GET` | `/glossary/{term}` | Consultar lenguaje ciudadano |
| `GET` | `/rules` | Obtener reglas determinísticas |
| `GET` | `/rag/search?q=...` | Búsqueda léxica inicial |
| `POST` | `/rag/query` | Recuperación vectorial y respuesta con fuentes |
| `POST` | `/diagnostico-claro` | Diagnóstico informativo sobre un caso |

## Bases de datos recomendadas

### Opción 1: archivos JSON en memoria

Útil para:

- desarrollo local;
- hackatón;
- pocos usuarios;
- despliegues simples.

Ventajas:

- no requiere infraestructura;
- reglas fáciles de auditar;
- arranque rápido.

Limitaciones:

- las búsquedas RAG son léxicas;
- los cambios requieren reiniciar la API;
- no es ideal para escalar.

### Opción 2: SQLite con FTS5

Útil para un backend local con búsqueda textual rápida.

Tablas sugeridas:

```sql
CREATE TABLE chunks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    source_file TEXT NOT NULL,
    source_url TEXT,
    topic TEXT NOT NULL,
    section TEXT,
    page INTEGER,
    tags_json TEXT NOT NULL,
    priority TEXT NOT NULL
);

CREATE VIRTUAL TABLE chunks_fts USING fts5(
    id UNINDEXED,
    title,
    text,
    tags
);
```

SQLite permite reemplazar la búsqueda simple del ejemplo FastAPI por búsquedas `MATCH`.

### Opción 3: PostgreSQL con pgvector

Es la opción recomendada cuando se necesita recuperación semántica, filtros y escalabilidad.

Esquema sugerido:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE rag_chunks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    source_file TEXT NOT NULL,
    source_url TEXT,
    topic TEXT NOT NULL,
    section TEXT,
    page INTEGER,
    tags JSONB NOT NULL DEFAULT '[]',
    priority TEXT NOT NULL,
    embedding VECTOR(768)
);

CREATE INDEX rag_chunks_embedding_idx
ON rag_chunks
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX rag_chunks_topic_idx ON rag_chunks(topic);
CREATE INDEX rag_chunks_tags_idx ON rag_chunks USING gin(tags);
```

La dimensión `768` corresponde al modelo local
`text-embedding-nomic-embed-text-v1.5`. Debe comprobarse antes de crear la tabla si se
reemplaza el modelo.

Supabase puede utilizarse como PostgreSQL administrado con la extensión pgvector.

## Embeddings mediante LM Studio

LM Studio expone una API compatible con OpenAI en:

```text
http://127.0.0.1:1234/v1
```

Modelo disponible para embeddings:

```text
text-embedding-nomic-embed-text-v1.5
```

Cargarlo:

```powershell
lms load text-embedding-nomic-embed-text-v1.5 --identifier sat-embeddings --yes
```

Ejemplo Python:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:1234/v1",
    api_key="lm-studio",
)

response = client.embeddings.create(
    model="sat-embeddings",
    input="Plazo para presentar descargo contra una papeleta",
)

embedding = response.data[0].embedding
```

Para indexar:

1. leer cada línea de `knowledge/chunks/rag_chunks.jsonl`;
2. generar el embedding usando solamente `title + text + tags`;
3. guardar el chunk, metadatos y embedding;
4. conservar `source_file`, `page` y `source_url`;
5. no indexar nuevamente un `id` sin actualizarlo explícitamente.

## Flujo recomendado para `/rag/query`

Entrada:

```json
{
  "question": "¿Qué sucede si no atiendo la resolución de ejecución coactiva?",
  "topic": "ejecucion_coactiva",
  "limit": 5
}
```

Proceso:

1. Generar embedding de la pregunta.
2. Recuperar chunks similares con filtros por `topic`, `tags` y `priority`.
3. Priorizar reglas determinísticas de `app/data/reglas-plazos.json`.
4. Entregar al LLM solamente los chunks recuperados.
5. Exigir que el LLM cite las fuentes recuperadas.
6. Devolver respuesta, fuentes y disclaimer.

Salida recomendada:

```json
{
  "answer": "La Resolución de Ejecución Coactiva contiene un mandato...",
  "sources": [
    {
      "file": "06-procedimiento-ejecucion-coactiva.pdf",
      "page": 7,
      "chunk_id": "chunk_0000"
    }
  ],
  "requires_manual_review": false,
  "disclaimer": "Información orientativa; verifica tu expediente y los canales oficiales."
}
```

## Diagnóstico Claro

El endpoint conceptual debe recibir:

```json
{
  "caseId": "demo-m42-riesgo-coactivo",
  "userNarrativeTranscript": "Recibí una resolución y deseo saber qué opciones tengo.",
  "queryDate": "2026-06-13"
}
```

El backend debe:

1. obtener el caso y la etapa desde los JSON determinísticos;
2. identificar plazos y riesgos sin pedirlos al LLM;
3. resumir la narrativa sin conservar datos sensibles innecesarios;
4. recuperar chunks RAG relevantes;
5. sugerir documentos y opciones;
6. seleccionar un canal oficial;
7. incluir fuentes y disclaimer.

La implementación TypeScript de referencia está en:

```text
lib/knowledge/diagnosticoClaro.ts
```

## Seguridad y privacidad

- No almacenar narrativas, audios, placas, DNI o expedientes reales sin consentimiento.
- No enviar datos personales a servicios externos por defecto.
- Limitar tamaño de solicitudes y aplicar rate limiting.
- Registrar IDs de fuentes y chunks, no narrativas completas.
- Tratar los casos demo como datos ficticios.
- No prometer resultados ni emitir asesoría legal definitiva.

## Calidad y revisión manual

Las fuentes OCR pueden contener errores. Antes de convertir texto OCR en una regla:

1. revisar la página original;
2. contrastar con una fuente oficial vigente;
3. conservar archivo y página;
4. marcar `requires_manual_review: true` si existe ambigüedad.

No deben generarse reglas determinísticas directamente desde páginas calificadas como `low`
sin revisión humana.

## Operación recomendada

Cuando se agreguen o modifiquen fuentes:

```powershell
# Solo cuando sea necesario repetir OCR
python scripts\ocr_with_lmstudio.py

# Regenerar documentos, chunks y JSON
python scripts\process_knowledge.py

# Revisar resultados
Get-Content knowledge\reports\processing-report.md
Get-Content knowledge\reports\ocr-lmstudio-report.md
```

Después se debe volver a indexar `rag_chunks.jsonl` en la base vectorial utilizando el `id` de
cada chunk como clave primaria.

## Alcance y advertencia

Este repositorio está preparado para un MVP y para construir una API FastAPI sobre datos
conservadores y trazables. Todavía requiere validación legal y completar la tabla oficial de
infracciones antes de utilizarse como una fuente normativa definitiva.
