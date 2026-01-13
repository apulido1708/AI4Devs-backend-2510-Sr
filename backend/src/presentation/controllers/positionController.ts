import { Request, Response } from 'express';
import { getCandidatesForPosition } from '../../application/services/positionService';

export const getCandidatesForPositionController = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id);
    
    // Validar que positionId es un número válido
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Invalid position ID format' });
    }

    const candidates = await getCandidatesForPosition(positionId);
    res.status(200).json(candidates);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Position not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Exportar con el nombre que espera la ruta
export { getCandidatesForPositionController as getCandidatesForPosition };
