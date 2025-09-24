
import supabase from './supabaseService'


export async function fetchEventRooms(eventId) {
  try {
    const { data, error } = await supabase
      .from('examination_room')
      .select(`
        id,
        room,
        supervisor,
        event,
        room:room (
          label,
          capacity
        ),
        supervisor:teacher (
          acro,
          names
        )
      `)
      .eq('event', eventId);

    if (error) {
      console.error('Erreur lors de la récupération des locaux:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des locaux:', error);
    throw error;
  }
}


export async function fetchAvailableRooms(eventId) {
  try {
    // 1. Récupérer tous les locaux
    const { data: allRooms, error: roomsError } = await supabase
      .from('room')
      .select('*');

    if (roomsError) {
      console.error('Erreur lors de la récupération des locaux:', roomsError);
      throw roomsError;
    }

    // 2. Récupérer les locaux déjà alloués à cette épreuve
    const { data: allocatedRooms, error: allocatedError } = await supabase
      .from('examination_room')
      .select('room')
      .eq('event', eventId);

    if (allocatedError) {
      console.error('Erreur lors de la récupération des locaux alloués:', allocatedError);
      throw allocatedError;
    }

    // 3. Filtrer les locaux non alloués
    const allocatedRoomLabels = allocatedRooms?.map(item => item.room) || [];
    const availableRooms = allRooms.filter(room => !allocatedRoomLabels.includes(room.label));

    return availableRooms || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des locaux disponibles:', error);
    throw error;
  }
}


export async function fetchTeachers() {
  try {
    const { data, error } = await supabase
      .from('teacher')
      .select('acro, names');

    if (error) {
      console.error('Erreur lors de la récupération des enseignants:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants:', error);
    throw error;
  }
}

export async function addRoomToEvent(eventId, roomLabel, supervisorAcro = null) {
  try {
    const { data, error } = await supabase
      .from('examination_room')
      .insert({
        event: eventId,
        room: roomLabel,
        supervisor: supervisorAcro
      })
      .select();

    if (error) {
      console.error('Erreur lors de l\'ajout du local à l\'épreuve:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Erreur lors de l\'ajout du local à l\'épreuve:', error);
    throw error;
  }
}

export async function fetchAssignedSupervisors(eventId, excludeRoomId = null) {
  try {
    // Construire la requête de base
    let query = supabase
      .from('examination_room')
      .select(`
        id,
        supervisor
      `)
      .eq('event', eventId)
      .not('supervisor', 'is', null);

    // Si un ID de local est fourni à exclure, afin de récupérer l'enseignant actuel
    // dans la liste disponible lorsqu'on modifie l'assignation de son propre local
    if (excludeRoomId) {
      query = query.not('id', 'eq', excludeRoomId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des surveillants assignés:', error);
      throw error;
    }

    // Extraire uniquement les acro des superviseurs
    return data.map(room => room.supervisor).filter(Boolean);
  } catch (error) {
    console.error('Erreur lors de la récupération des surveillants assignés:', error);
    throw error;
  }
}

export async function fetchAvailableSupervisors(eventId, currentRoomId = null, currentSupervisor = null) {
  try {
    // 1. Récupérer tous les enseignants
    const allTeachers = await fetchTeachers();

    // 2. Récupérer les enseignants déjà assignés
    const assignedSupervisors = await fetchAssignedSupervisors(eventId, currentRoomId);

    // 3. Filtrer pour obtenir uniquement les enseignants disponibles
    return allTeachers.filter(teacher =>
      teacher.acro === currentSupervisor || !assignedSupervisors.includes(teacher.acro)
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des surveillants disponibles:', error);
    throw error;
  }
}
