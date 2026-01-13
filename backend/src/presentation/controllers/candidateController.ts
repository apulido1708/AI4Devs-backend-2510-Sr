import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        
        // Validar que candidateId es un número válido
        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID format' });
        }

        // Validar que stage existe en body y es string no vacío
        const { stage } = req.body;
        if (!stage || typeof stage !== 'string' || stage.trim().length === 0) {
            return res.status(400).json({ error: 'Stage is required and must be a non-empty string' });
        }

        const updatedApplication = await updateCandidateStage(candidateId, stage.trim());
        res.status(200).json({ 
            message: 'Candidate stage updated successfully', 
            data: updatedApplication 
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Candidate not found' || 
                error.message === 'Application not found for this candidate' ||
                error.message.includes('InterviewStep')) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Exportar con el nombre que espera la ruta
export { updateCandidateStageController as updateCandidateStage };

export { addCandidate };