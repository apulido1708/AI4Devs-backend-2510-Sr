import { prisma } from '../../infrastructure/prisma';

export interface CandidateKanbanItem {
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number | null;
}

export const getCandidatesForPosition = async (positionId: number): Promise<CandidateKanbanItem[]> => {
  // Verificar que la Position existe
  const position = await prisma.position.findUnique({
    where: { id: positionId }
  });

  if (!position) {
    throw new Error('Position not found');
  }

  // Buscar Applications por positionId con todas las relaciones necesarias
  const applications = await prisma.application.findMany({
    where: { positionId },
    include: {
      candidate: {
        select: { firstName: true, lastName: true }
      },
      interviewStep: {
        select: { name: true }
      },
      interviews: {
        select: { score: true }
      }
    }
  });

  // Transformar cada Application a CandidateKanbanItem
  return applications.map(application => {
    // Calcular fullName
    const fullName = `${application.candidate.firstName} ${application.candidate.lastName}`;

    // Obtener nombre del step actual
    const currentInterviewStep = application.interviewStep.name;

    // Calcular averageScore
    const scores = application.interviews
      .map(i => i.score)
      .filter(score => score !== null) as number[];
    
    const averageScore = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : null;

    return {
      applicationId: application.id!,
      fullName,
      currentInterviewStep,
      averageScore
    };
  });
};
