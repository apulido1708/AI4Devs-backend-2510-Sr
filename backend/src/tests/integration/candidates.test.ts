import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('PUT /candidates/:id/stage', () => {
    beforeAll(async () => {
        // Setup: Los datos del seed deberían estar disponibles
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Casos exitosos', () => {
        it('debería actualizar el stage de un candidato correctamente', async () => {
            // Usar candidate2 que está en position1 (interviewFlow1)
            const response = await request(app)
                .put('/candidates/2/stage')
                .send({ stage: 'Initial Screening' })
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Candidate stage updated successfully');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('currentInterviewStep');
            expect(typeof response.body.data.currentInterviewStep).toBe('number');
        });

        it('debería actualizar a Manager Interview correctamente', async () => {
            const response = await request(app)
                .put('/candidates/2/stage')
                .send({ stage: 'Manager Interview' })
                .expect(200);

            expect(response.body.message).toBe('Candidate stage updated successfully');
            expect(response.body.data.currentInterviewStep).toBeGreaterThan(0);
        });
    });

    describe('Casos de error - Validaciones', () => {
        it('debería retornar 400 si stage falta en el body', async () => {
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Stage is required and must be a non-empty string');
        });

        it('debería retornar 400 si stage es string vacío', async () => {
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({ stage: '' })
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Stage is required and must be a non-empty string');
        });

        it('debería retornar 400 si stage no es string', async () => {
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({ stage: 123 })
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('debería retornar 400 si el candidateId es inválido', async () => {
            const response = await request(app)
                .put('/candidates/abc/stage')
                .send({ stage: 'Technical Interview' })
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Invalid candidate ID format');
        });
    });

    describe('Casos de error - Recursos no encontrados', () => {
        it('debería retornar 404 si el candidato no existe', async () => {
            const response = await request(app)
                .put('/candidates/99999/stage')
                .send({ stage: 'Technical Interview' })
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Candidate not found');
        });

        it('debería retornar 404 si el candidato no tiene Application', async () => {
            // Crear un candidato sin application
            const candidateWithoutApp = await prisma.candidate.create({
                data: {
                    firstName: 'Test',
                    lastName: 'Candidate',
                    email: `test-${Date.now()}@example.com`,
                },
            });

            const response = await request(app)
                .put(`/candidates/${candidateWithoutApp.id}/stage`)
                .send({ stage: 'Technical Interview' })
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Application not found for this candidate');

            // Limpiar
            await prisma.candidate.delete({ where: { id: candidateWithoutApp.id } });
        });

        it('debería retornar 404 si el InterviewStep no existe en el InterviewFlow', async () => {
            const response = await request(app)
                .put('/candidates/2/stage')
                .send({ stage: 'Non-existent Stage Name' })
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('InterviewStep');
        });
    });
});
