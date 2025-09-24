import supabase from './supabaseService'

export async function fetchExaminationRoomById(examinationRoomId) {
  try {
    const { data, error } = await supabase
      .from('examination_room')
      .select(`
        id,
        event,
        room,
        supervisor,
        room:room (
          label,
          capacity
        ),
        supervisor:teacher (
          acro,
          names
        ),
        event:event (
          id,
          label,
          session_compo,
          session_compo:session_compo (
            id,
            ue
          )
        )
      `)
      .eq('id', examinationRoomId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des détails du local:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du local:', error);
    throw error;
  }
}

export async function fetchStudentsByUE(ueCode) {
  try {
    const { data, error } = await supabase
      .from('pae')
      .select(`
        id,
        student_id,
        group,
        ue,
        student:student (
          student_id,
          firstname,
          lastname
        )
      `)
      .eq('ue', ueCode);

    if (error) {
      console.error('Erreur lors de la récupération des étudiants:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    throw error;
  }
}

export async function fetchExaminations(examinationRoomId) {
  try {
    const { data, error } = await supabase
      .from('examination')
      .select(`
        id,
        student,
        examination_room
      `)
      .eq('examination_room', examinationRoomId);

    if (error) {
      console.error('Erreur lors de la récupération des présences:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error);
    throw error;
  }
}


export async function markStudentPresent(examinationRoomId, studentId) {
  try {
    const { data, error } = await supabase
      .from('examination')
      .insert({
        examination_room: examinationRoomId,
        student: studentId
      })
      .select();

    if (error) {
      console.error('Erreur lors du marquage de l\'étudiant comme présent:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Erreur lors du marquage de l\'étudiant comme présent:', error);
    throw error;
  }
}

export async function markStudentAbsent(examinationRoomId, studentId) {
  try {
    const { error } = await supabase
      .from('examination')
      .delete()
      .eq('examination_room', examinationRoomId)
      .eq('student', studentId);

    if (error) {
      console.error('Erreur lors du marquage de l\'étudiant comme absent:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors du marquage de l\'étudiant comme absent:', error);
    throw error;
  }
}

export async function updateRoomSupervisor(examinationRoomId, supervisorAcro) {
  try {
    const { data, error } = await supabase
      .from('examination_room')
      .update({ supervisor: supervisorAcro })
      .eq('id', examinationRoomId)
      .select();

    if (error) {
      console.error('Erreur lors de la mise à jour du surveillant:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Erreur lors de la mise à jour du surveillant:', error);
    throw error;
  }
}
