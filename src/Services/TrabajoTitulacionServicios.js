import { getProposals, saveProposal, updateProposal, findProposalById } from "../Utils/TrabajoTitulacionStorage"

// Función para enviar una nueva propuesta
export function submitNewProposal(proposalData) {
  try {
    const newProposal = saveProposal(proposalData)
    return {
      success: true,
      message: "Propuesta enviada exitosamente. Será revisada por el comité académico.",
      proposal: newProposal,
    }
  } catch (error) {
    console.error("Error en submitNewProposal:", error)
    return {
      success: false,
      message: "Ocurrió un error al enviar la propuesta. Inténtalo de nuevo.",
    }
  }
}

// Función para obtener todas las propuestas (para administradores/profesores)
export function getAllProposals() {
  return getProposals()
}

// Función para obtener las propuestas de un estudiante específico
export function getProposalsByStudentUsername(username) {
  const allProposals = getProposals()
  return allProposals.filter((proposal) => proposal.studentUsername === username)
}

// Función para evaluar una propuesta
export function evaluateProposal(proposalId, grade, comments, tutorName, newStatus) {
  try {
    const proposal = findProposalById(proposalId)
    if (!proposal) {
      return { success: false, message: "Propuesta no encontrada." }
    }

    const updatedProposal = {
      ...proposal,
      grade: grade,
      comments: comments,
      status: newStatus, // Usar el newStatus pasado como argumento
      tutor: tutorName, // Asignar el nombre del tutor que evalúa
      lastEvaluated: new Date().toISOString(),
    }

    updateProposal(updatedProposal)
    return { success: true, message: "Propuesta evaluada exitosamente.", proposal: updatedProposal }
  } catch (error) {
    console.error("Error en evaluateProposal:", error)
    return { success: false, message: "Ocurrió un error al evaluar la propuesta." }
  }
}

// Función para obtener el estado de una propuesta basado en la calificación
export function getProposalStatus(proposal) {
  // Si la propuesta ya tiene un estado definido (Aprobado, Rechazado, En Revisión), lo usamos
  if (["Aprobado", "Rechazado", "En Revisión"].includes(proposal.status)) {
    return proposal.status
  }
  // Si no, y tiene calificación, determinamos el estado
  if (proposal.grade !== null && proposal.grade !== undefined) {
    return proposal.grade >= 7 ? "Aprobado" : "Rechazado"
  }
  // Si no tiene calificación pero tiene comentarios o tutor, está en revisión
  if (proposal.comments || proposal.tutor) {
    return "En Revisión"
  }
  return "Pendiente" // Por defecto
}
