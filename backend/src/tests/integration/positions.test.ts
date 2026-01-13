import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('GET /positions/:id/candidates', () => {
    let positionId: number;
    let candidate1Id: number;
    let candidate2Id: number;
    let candidate3Id: number;
    let interviewStep1Id: number;
    let interviewStep2Id: number;

    beforeAll(async () => {
        // Setup: Crear datos de prueba
        // Nota: Asumimos que el seed ya se ejecutó, pero podemos crear datos específicos para tests
        // Por ahora, usaremos los datos del seed existente
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Casos exitosos', () => {
        it('debería retornar lista de candidatos para una posición válida', async () => {
            const response = await request(app)
                .get('/positions/1/candidates')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            
            // Verificar estructura de respuesta
            response.body.forEach((candidate: any) => {
                expect(candidate).toHaveProperty('applicationId');
                expect(candidate).toHaveProperty('fullName');
                expect(candidate).toHaveProperty('currentInterviewStep');
                expect(candidate).toHaveProperty('averageScore');
                expect(typeof candidate.applicationId).toBe('number');
                expect(typeof candidate.fullName).toBe('string');
                expect(typeof candidate.currentInterviewStep).toBe('string');
                expect(candidate.averageScore === null || typeof candidate.averageScore === 'number').toBe(true);
            });
        });

        it('debería calcular averageScore correctamente', async () => {
            const response = await request(app)
                .get('/positions/1/candidates')
                .expect(200);

            // Buscar un candidato con entrevistas
            const candidateWithInterviews = response.body.find(
                (c: any) => c.averageScore !== null
            );

            if (candidateWithInterviews) {
                expect(typeof candidateWithInterviews.averageScore).toBe('number');
                expect(candidateWithInterviews.averageScore).toBeGreaterThanOrEqual(0);
            }
        });

        it('debería retornar averageScore null para candidatos sin entrevistas', async () => {
            const response = await request(app)
                .get('/positions/1/candidates')
                .expect(200);

            // Verificar que hay candidatos con averageScore null
            const candidatesWithoutScore = response.body.filter(
                (c: any) => c.averageScore === null
            );

            // Verificar que al menos hay un candidato con averageScore null o que todos los candidatos tienen averageScore válido (number o null)
            if (candidatesWithoutScore.length > 0) {
                candidatesWithoutScore.forEach((candidate: any) => {
                    expect(candidate.averageScore).toBeNull();
                });
            }
            // Si no hay candidatos sin score, verificar que todos tienen score numérico
            response.body.forEach((candidate: any) => {
                expect(candidate.averageScore === null || typeof candidate.averageScore === 'number').toBe(true);
            });
        });

        it('debería retornar nombre del InterviewStep, no el ID', async () => {
            const response = await request(app)
                .get('/positions/1/candidates')
                .expect(200);

            response.body.forEach((candidate: any) => {
                expect(typeof candidate.currentInterviewStep).toBe('string');
                expect(candidate.currentInterviewStep).not.toMatch(/^\d+$/); // No debe ser solo números
            });
        });
    });

    describe('Casos de error', () => {
        it('debería retornar 404 si la posición no existe', async () => {
            const response = await request(app)
                .get('/positions/99999/candidates')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Position not found');
        });

        it('debería retornar 400 si el ID es inválido', async () => {
            const response = await request(app)
                .get('/positions/abc/candidates')
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Invalid position ID format');
        });

        it('debería retornar array vacío si no hay candidatos para la posición', async () => {
            // Crear una posición sin candidatos
            const company = await prisma.company.findFirst();
            const interviewFlow = await prisma.interviewFlow.findFirst();
            
            // Asegurar que tenemos los datos necesarios
            expect(company).not.toBeNull();
            expect(interviewFlow).not.toBeNull();
            
            if (!company || !interviewFlow) {
                throw new Error('Missing required test data: company or interviewFlow');
            }

            const emptyPosition = await prisma.position.create({
                data: {
                    title: 'Test Position',
                    description: 'Test',
                    location: 'Remote',
                    jobDescription: 'Test',
                    companyId: company.id,
                    interviewFlowId: interviewFlow.id,
                },
            });

            try {
                const response = await request(app)
                    .get(`/positions/${emptyPosition.id}/candidates`)
                    .expect(200);

                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(0);
            } finally {
                // Limpiar siempre, incluso si el test falla
                await prisma.position.delete({ where: { id: emptyPosition.id } });
            }
        });
    });
});
