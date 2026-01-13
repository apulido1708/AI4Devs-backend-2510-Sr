# 📦 Contexto del Proyecto

Repositorio full‑stack con la siguiente estructura:

- `frontend/`: React
- `backend/`: Express + TypeScript + Prisma ORM

El backend sigue una arquitectura por capas:

- `application/` → lógica de aplicación / casos de uso
- `domain/` → modelos de dominio
- `infrastructure/` → acceso a datos (Prisma)
- `presentation/` → controladores (Express)
- `routes/` → definición de rutas
- `prisma/` → schema Prisma, migraciones y seed

Base de datos: **PostgreSQL** (Docker + Prisma).

---

## 🎯 Objetivo del Ejercicio

Implementar **dos nuevos endpoints** para gestionar una vista tipo **kanban de candidatos** asociados a una posición.

---

## 1️⃣ GET `/positions/:id/candidates`

### 📌 Descripción

Devuelve todos los candidatos que están en proceso para una posición concreta (`positionId`).

Cada candidato debe incluir la siguiente información:

- **fullName**  
  Nombre completo del candidato (`firstName + lastName`)  
  → tabla `Candidate`

- **currentInterviewStep**  
  Etapa actual del proceso  
  → campo `current_interview_step` en `Application`

- **averageScore**  
  Media de las puntuaciones de todas las entrevistas realizadas  
  → tabla `Interview` (campo `score`)

### 📊 Reglas

- Un candidato está vinculado a una posición a través de `Application`
- Una `Application` puede tener varias `Interview`
- Si no hay entrevistas, la media puede ser `null` o `0`

---

## 2️⃣ PUT `/candidates/:id/stage`

### 📌 Descripción

Actualiza la etapa del proceso de entrevistas de un candidato específico.

### 📥 Request Body

```json
{
  "stage": "Technical Interview"
}
```

### 📊 Reglas

- El `id` corresponde al **Candidate**
- Debes localizar su `Application` activa
- Actualizar el campo `current_interview_step`
- Manejar errores si:
  - El candidato no existe
  - No existe una application asociada
  - El campo `stage` no viene en el body

---

## 🛠️ Instrucciones de Implementación

### 🔹 Rutas

Añade las rutas correspondientes:

**`routes/positions.routes.ts`**
```ts
router.get('/:id/candidates', getCandidatesForPosition);
```

**`routes/candidates.routes.ts`**
```ts
router.put('/:id/stage', updateCandidateStage);
```

---

### 🔹 Controladores (`presentation/`)

Crea los controladores:

- `getCandidatesForPosition(req, res)`
- `updateCandidateStage(req, res)`

Responsabilidades:
- Leer `params` y `body`
- Llamar a la lógica de aplicación
- Manejar respuestas HTTP y errores

---

### 🔹 Lógica de Aplicación (`application/`)

Implementa los casos de uso que:

#### Para GET:
- Busquen las `Application` por `positionId`
- Incluyan relaciones con:
  - `Candidate`
  - `Interview`
- Devuelvan una lista con la forma:
```ts
{
  fullName: string;
  currentInterviewStep: string;
  averageScore: number | null;
}
```

#### Para PUT:
- Busquen la `Application` asociada al `candidateId`
- Actualicen `current_interview_step`
- Devuelvan la entidad actualizada o un mensaje de éxito

---

### 🔹 Acceso a Datos (`infrastructure/`)

- Usa **Prisma Client**
- Aprovecha `include` y relaciones
- Puedes crear funciones de repositorio si el proyecto ya sigue ese patrón

---

### 🔹 Validaciones y Errores

Asegúrate de manejar correctamente:

- `404` → candidato / posición / application no encontrada
- `400` → body inválido o campo `stage` ausente
- `500` → errores inesperados

---

## 🧪 Testing (Opcional)

- Añade tests en `backend/src/tests/`
- Usa datos del `seed.ts`
- Prioriza tests de integración para los endpoints

---

## 🧠 Cómo usar este archivo en Cursor

1. Guarda este archivo como `cursor-task.md` en el repo
2. Abre Cursor
3. Abre cualquier archivo del backend (por ejemplo una ruta)
4. Selecciona todo este markdown
5. Ejecuta **Ask Cursor / ⌘K**
6. Pide que implemente el código siguiendo estas instrucciones

---

## ✅ Resultado Esperado

- Endpoints funcionales
- Código alineado con la arquitectura existente
- Prisma usado correctamente
- Respuestas listas para ser consumidas por una UI tipo kanban

---

