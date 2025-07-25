/**
 * Utilidades para manejo de localStorage - Sistema de Trabajos de Titulación
 */
const PROPOSALS_KEY = "titulacionProposals"

// Obtener todas las propuestas
export function getProposals() {
  try {
    const proposals = localStorage.getItem(PROPOSALS_KEY)
    return proposals ? JSON.parse(proposals) : []
  } catch (error) {
    console.error("Error al obtener propuestas:", error)
    return []
  }
}

// Guardar una nueva propuesta
export function saveProposal(proposalData) {
  try {
    const proposals = getProposals()
    const newProposal = {
      id: `PROP-${Date.now()}`, // ID único
      studentUsername: proposalData.studentUsername, // Username del estudiante que la sube
      studentName: proposalData.studentName.trim(),
      cedula: proposalData.cedula.trim(),
      career: proposalData.career,
      semester: proposalData.semester,
      title: proposalData.title.trim(),
      area: proposalData.area,
      modalidad: proposalData.modalidad,
      resumen: proposalData.resumen.trim(),
      justificacion: proposalData.justificacion.trim(),
      dateSubmitted: new Date().toISOString(),
      status: "Pendiente", // 'Pendiente', 'En Revisión', 'Aprobado', 'Rechazado'
      tutor: null, // Asignado después de la aprobación o manualmente
      grade: null, // Calificación numérica
      comments: null, // Comentarios del tutor/administrador
    }

    proposals.push(newProposal)
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals))
    return newProposal
  } catch (error) {
    console.error("Error al guardar propuesta:", error)
    throw new Error("Error al guardar propuesta")
  }
}

// Actualizar una propuesta existente
export function updateProposal(updatedProposal) {
  try {
    const proposals = getProposals()
    const index = proposals.findIndex((p) => p.id === updatedProposal.id)
    if (index !== -1) {
      proposals[index] = { ...proposals[index], ...updatedProposal }
      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals))
      return proposals[index]
    }
    return null // Propuesta no encontrada
  } catch (error) {
    console.error("Error al actualizar propuesta:", error)
    throw new Error("Error al actualizar propuesta")
  }
}

// Buscar propuesta por ID
export function findProposalById(id) {
  try {
    const proposals = getProposals()
    return proposals.find((p) => p.id === id)
  } catch (error) {
    console.error("Error al buscar propuesta por ID:", error)
    return null
  }
}

// Limpiar todas las propuestas (útil para desarrollo/testing)
export function clearAllProposals() {
  try {
    localStorage.removeItem(PROPOSALS_KEY)
    return true
  } catch (error) {
    console.error("Error al limpiar todas las propuestas:", error)
    return false
  }
}
