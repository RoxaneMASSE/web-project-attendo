// src/services/eventService.js
import supabase from './supabaseService'

/**
 * Récupère la composition de session pour une session et une UE spécifiques
 * @param {number} sessionId - ID de la session
 * @param {string} ueCode - Code de l'UE
 * @returns {Promise<Object>} Détails de la composition de session
 */
export async function fetchSessionCompo(sessionId, ueCode) {
  try {
    const { data, error } = await supabase
      .from('session_compo')
      .select('*')
      .eq('session', sessionId)
      .eq('ue', ueCode)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la composition de session:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la composition de session:', error);
    throw error;
  }
}

/**
 * Récupère toutes les épreuves pour une session_compo spécifique
 * @param {number} sessionCompoId - ID de la composition de session
 * @returns {Promise<Array>} Liste des épreuves
 */
export async function fetchEvents(sessionCompoId) {
  try {
    const { data, error } = await supabase
      .from('event')
      .select('*')
      .eq('session_compo', sessionCompoId);

    if (error) {
      console.error('Erreur lors de la récupération des épreuves:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des épreuves:', error);
    throw error;
  }
}

/**
 * Ajoute une nouvelle épreuve pour une composition de session
 * @param {number} sessionCompoId - ID de la composition de session
 * @param {string} label - Nom de l'épreuve
 * @returns {Promise<Object>} Détails de l'épreuve créée
 */
export async function addEvent(sessionCompoId, label) {
  try {
    const { data, error } = await supabase
      .from('event')
      .insert({
        session_compo: sessionCompoId,
        label: label,
        completed: false
      })
      .select();

    if (error) {
      console.error('Erreur lors de l\'ajout de l\'épreuve:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'épreuve:', error);
    throw error;
  }
}

export async function fetchEventById(eventId) {
  try {
    const { data, error } = await supabase
      .from('event')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de l\'épreuve:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'épreuve:', error);
    throw error;
  }
}
