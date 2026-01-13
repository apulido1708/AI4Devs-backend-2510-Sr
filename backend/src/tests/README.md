# Tests - Endpoints Kanban

## Instalación

Primero, instala las dependencias necesarias:

```bash
npm install
# o
pnpm install
```

Esto instalará `supertest` y `@types/supertest` que son necesarios para los tests.

## Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test
# o
pnpm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage
```

## Estructura de Tests

- `integration/positions.test.ts` - Tests para GET `/positions/:id/candidates`
- `integration/candidates.test.ts` - Tests para PUT `/candidates/:id/stage`
- `jest.setup.ts` - Configuración global de Jest

## Requisitos

- Base de datos con datos del seed ejecutado
- Servidor de base de datos corriendo (Docker Compose)
- Variables de entorno configuradas

## Notas

Los tests son de integración y requieren:
- Base de datos real (no mocks)
- Datos del seed disponibles
- Algunos tests crean datos temporales que se limpian después
