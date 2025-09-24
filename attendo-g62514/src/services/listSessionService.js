// src/services/sessionService.js
import supabase from './supabaseService'


export async function fetchSessions() {
  const { data, error } = await supabase
    .from('session')
    .select('*')

  if (error) {
    console.error('Erreur lors de la récupération des sessions:', error)
    throw error
  }

    return data || []
}

export async function addSession(sessionName) {
  const { data, error } = await supabase
    .from('session')
    .insert({ label: sessionName })
    .select()

  if (error) {
    console.error('Erreur lors de l\'ajout de la session:', error)
    throw error
  }

  return data[0]
}
