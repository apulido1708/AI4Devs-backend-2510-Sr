# Prompts para el desarrollo del Lab de backend.

## Prompt inicial.


## 🛠️ Prompt Inicial – Revisión de Estructura del Repositorio

Debemos realizar la implementación de @prompts-APC/requirement.md 

## ✅ Objetivo

Antes de implementar nuevos endpoints, quiero que revises cómo está estructurado el backend del proyecto para entender:

1. Dónde debería ubicarse la lógica para nuevos casos de uso (`GET /positions/:id/candidates`, `PUT /candidates/:id/stage`)
2. Qué archivos o capas del sistema deben modificarse (rutas, controladores, servicios, etc.)
3. Si existe código que ya pueda ser reutilizado (por ejemplo, servicios de Application, Candidate o Interview)

---

## 📦 Estructura del repositorio

El backend está organizado con estas carpetas principales dentro de `backend/src/`:

- `routes/`: define las rutas de Express
- `presentation/`: contiene los controladores
- `application/`: contiene la lógica de aplicación / servicios
- `infrastructure/`: acceso a datos (Prisma client)
- `domain/`: modelos o lógica de dominio
- `prisma/`: esquema de base de datos Prisma (fuera de `src/`)

---

## 🧠 Qué quiero que hagas

1. **Analiza la estructura y estilo del código del repositorio**:
   - ¿Dónde están definidos los controladores y servicios existentes?
   - ¿Qué patrón o convención se sigue para dividir la lógica?

2. **Sugiere un punto de entrada para cada endpoint**:
   - ¿En qué archivo o carpeta debería comenzar a escribir el código?
   - ¿Debo crear nuevos servicios o puedo extender uno ya existente?

3. **Identifica dependencias clave**:
   - ¿Dónde se hace acceso a `Application`, `Candidate` o `Interview`?
   - ¿Hay repositorios o helpers para trabajar con estos modelos?

---

## 📌 Qué NO quiero aún

❌ No quiero que escribas código todavía.  
✅ Solo quiero tu análisis, recomendaciones y estructura sugerida.

---

Cuando termines el análisis, dime por dónde empezarías y qué modificarías primero.

## Salida del Prompt.

La salida del prompt fue un análisis detallado de la estructura que servira como contexto para la implementación.

## Prompt 2.

Una vez se tiene el contexto completo, utilice el modo plan de Cursor para hacer un plan de la implementación adicional a esto le agregue el manifiesto de buenas prácticas de Backend.


### Prompt.

# 🧩 Planificación Inicial de Implementación – Endpoints para Candidatos en Proceso

Vamos a comenzar la implementación de dos nuevos endpoints relacionados con el manejo de candidatos dentro de un sistema tipo kanban.  
Antes de escribir código, necesitamos definir un **plan detallado de implementación**, siguiendo las buenas prácticas definidas en `@.cursor/rules/backend-manifest.mdc`.

---

## 🧠 Objetivo del Plan

Quiero que analices los requisitos funcionales de los siguientes endpoints y generes un **plan de trabajo detallado** para implementarlos correctamente dentro de la estructura actual del backend.

---

## 📌 Endpoints a implementar

1. `GET /positions/:id/candidates`  
   Devuelve todos los candidatos en proceso para una posición específica, incluyendo:
   - Nombre completo del candidato (from `Candidate`)
   - `current_interview_step` (from `Application`)
   - Puntuación media de entrevistas (from `Interview.score`)

2. `PUT /candidates/:id/stage`  
   Permite actualizar el campo `current_interview_step` del candidato, con el nuevo valor recibido en el body.

---

## 🗂 Estructura del Proyecto

El backend está estructurado en:

- `routes/` → rutas Express
- `presentation/` → controladores
- `application/` → lógica de negocio / servicios
- `infrastructure/` → acceso a datos con Prisma
- `domain/` → tipos y modelos de dominio

La base de datos está manejada por Prisma ORM (PostgreSQL).

---

## ✅ Qué espero de ti

Quiero que me devuelvas un plan como este:

### 🔹 Plan de Implementación Propuesto

- [ ] **Revisión del modelo de datos actual**  
  Comprobar las relaciones entre `Position`, `Application`, `Candidate` e `Interview` en el schema Prisma.

- [ ] **Diseño de estructuras de datos necesarias**  
  ¿Es necesario definir DTOs o tipos intermedios para las respuestas?

- [ ] **Ubicación de lógica**  
  - Dónde se ubicará la lógica de cada endpoint (por ejemplo, en `/application/services/position/`)
  - Si se requieren nuevos controladores o se deben extender existentes

- [ ] **Diseño de funciones Prisma (queries y updates)**  
  - Consultas necesarias para el GET con agregaciones
  - Update eficiente para el PUT

- [ ] **Definición de rutas**  
  - Archivos donde se registrarán las rutas

- [ ] **Manejo de errores y validaciones**  
  - Qué errores debemos manejar (ej: 404, body inválido)
  - Cómo centralizar esas validaciones

- [ ] **Testing propuesto (opcional)**  
  Qué tipo de pruebas se sugiere agregar

---

## ❌ Qué NO quiero aún

- No escribas ningún código todavía
- No generes tipos, controladores ni rutas
- No modifiques el schema Prisma aún

---

Cuando estés listo, responde con una lista de tareas estructuradas siguiendo estas secciones. Asegúrate de seguir las recomendaciones de `@.cursor/rules/backend-manifest.mdc` sobre organización, modularidad y uso de capas.


### El resultado de este prompt fue un plan detallado de 7 pasos a realizar, desde las rutas a crear hasta los tests.

### Pasos adicionales:

Fue necesario un prompt adicional para iterar sobre las pruebas. 