// src/services/sessionDetailService.js
import supabase from './supabaseService'

/**
 * Récupère une session par son ID
 * @param {number} sessionId - ID de la session
 * @returns {Promise<Object>} Détails de la session
 */
export async function fetchSessionById(sessionId) {
  try {
    const { data, error } = await supabase
      .from('session')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) {
      console.error('Erreur lors de la récupération de la session:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error)
    throw error
  }
}

/**
 * Récupère toutes les UEs d'une session spécifique
 * @param {number} sessionId - ID de la session
 * @returns {Promise<Array>} Liste des UEs de la session
 */
export async function fetchSessionUEs(sessionId) {
  try {
    // D'abord récupérer toutes les compositions de session (session_compo) pour la session
    const { data: sessionCompos, error: compoError } = await supabase
      .from('session_compo')
      .select('ue')
      .eq('session', sessionId)

    if (compoError) {
      console.error('Erreur lors de la récupération des compositions de session:', compoError)
      throw compoError
    }

    // Si aucune UE n'est associée, retourner un tableau vide
    if (!sessionCompos || sessionCompos.length === 0) {
      return []
    }

    // Extraire les codes des UEs
    const ueCodes = sessionCompos.map(item => item.ue)

    // Récupérer les détails des UEs
    const { data: ues, error: ueError } = await supabase
      .from('ue')
      .select('*')
      .in('ue', ueCodes)

    if (ueError) {
      console.error('Erreur lors de la récupération des UEs:', ueError)
      throw ueError
    }

    return ues || []
  } catch (error) {
    console.error('Erreur lors de la récupération des UEs de la session:', error)
    throw error
  }
}

/**
 * Récupère toutes les UEs qui ne sont pas encore dans la session
 * @param {number} sessionId - ID de la session
 * @returns {Promise<Array>} Liste des UEs disponibles
 */
export async function fetchAvailableUEs(sessionId) {
  try {
    // 1. Récupérer toutes les UEs
    const { data: allUEs, error: ueError } = await supabase
      .from('ue')
      .select('*')

    if (ueError) {
      console.error('Erreur lors de la récupération de toutes les UEs:', ueError)
      throw ueError
    }

    if (!allUEs || allUEs.length === 0) {
      return []
    }

    // 2. Récupérer les UEs déjà dans la session
    const { data: sessionCompos, error: compoError } = await supabase
      .from('session_compo')
      .select('ue')
      .eq('session', sessionId)

    if (compoError) {
      console.error('Erreur lors de la récupération des compositions de session:', compoError)
      throw compoError
    }

    // 3. Filtrer les UEs qui ne sont pas dans la session
    const existingUECodes = sessionCompos?.map(item => item.ue) || []
    const availableUEs = allUEs.filter(ue => !existingUECodes.includes(ue.ue))

    return availableUEs
  } catch (error) {
    console.error('Erreur lors de la récupération des UEs disponibles:', error)
    throw error
  }
}

/**
 * Ajoute une UE à une session
 * @param {number} sessionId - ID de la session
 * @param {string} ueCode - Code de l'UE à ajouter
 * @returns {Promise<Object>} Détails de l'association créée
 */
export async function addUEToSession(sessionId, ueCode) {
  try {
    const { data, error } = await supabase
      .from('session_compo')
      .insert({ session: sessionId, ue: ueCode })
      .select()

    if (error) {
      console.error('Erreur lors de l\'ajout de l\'UE à la session:', error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'UE à la session:', error)
    throw error
  }
}
