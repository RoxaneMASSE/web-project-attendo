<template>
  <div class="p-6">
    <Breadcrumb />
    <h1 class="text-2xl font-bold mb-4">Prise de présence du local {{ room.label || '' }} par {{ supervisor || 'Non assigné' }}</h1>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Chargement des données...</p>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!loading">
      <!-- Section du surveillant -->
      <div class="mb-6 bg-white p-4 shadow rounded">
        <div class="flex items-center mb-4">
          <span class="mr-2 font-semibold">Surveillant :</span>
          <div v-if="editingSupervisor" class="flex space-x-2">
            <select
              v-model="selectedSupervisor"
              class="border p-2 rounded"
            >
              <option value="" disabled selected>Choisissez un surveillant</option>
              <option v-for="teacher in teachers" :key="teacher.acro" :value="teacher.acro">
                {{ teacher.acro }} - {{ teacher.names }}
              </option>
            </select>
            <button
              @click="defineSupervisor"
              class="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
            >
              Définir le surveillant
            </button>
          </div>
          <div v-else class="flex space-x-2">
            <span>{{ supervisorName }}</span>
            <button
              @click="editingSupervisor = true"
              class="text-purple-900 underline hover:text-purple-700 cursor-pointer"
            >
              Choisir/modifier le surveillant
            </button>
          </div>
        </div>
      </div>

      <!-- Alerte de capacité dépassée -->
      <div v-if="isOverCapacity" class="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <div class="flex">
          <div class="py-1 mr-2">
            <svg class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p class="font-bold">Attention: Capacité dépassée</p>
            <p class="text-sm">
              Ce local a une capacité de {{ room.capacity }} places, mais {{ presentStudents.length }} étudiants sont marqués présents.
            </p>
          </div>
        </div>
      </div>

      <!-- Tableau des étudiants -->
      <BaseTable
        :headers="['MATRICULE', 'GROUP', 'NOM', 'PRÉNOM']"
        :items="students"
        :attributes="['student.student_id', 'group', 'student.lastname', 'student.firstname']"
        @action="toggleStudentPresence"
        :rowClick="true"
        :centerText="false"
        :rowClassFunction="(student) => ({ 'bg-purple-100': isPresentStudent(student.student.student_id), 'cursor-pointer': true })"
        :actionIdField="'student.student_id'"
        :emptyMessage="'Aucun étudiant trouvé pour cette UE'"
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb.vue'
import BaseTable from '@/components/BaseTable.vue'
import {
  fetchExaminationRoomById,
  fetchStudentsByUE,
  fetchExaminations,
  markStudentPresent,
  markStudentAbsent,
  updateRoomSupervisor
} from '../services/examinationService'
import { fetchAvailableSupervisors } from '../services/examinationRoomService'

export default {
  name: 'ExaminationView',
  components: {
    Breadcrumb,
    BaseTable
  },
  data() {
    return {
      examinationRoom: {},
      room: {},
      students: [],
      presentStudents: [],
      teachers: [],
      loading: true,
      error: null,
      editingSupervisor: false,
      selectedSupervisor: '',
      ueCode: '',
      supervisor: '',
      updatingStudents: new Set()
    }
  },
  computed: {
    roomId() {
      return Number(this.$route.params.roomId)
    },
    supervisorName() {
      if (this.examinationRoom.supervisor && this.examinationRoom.supervisor.acro) {
        return `${this.examinationRoom.supervisor.acro} (${this.examinationRoom.supervisor.names})`
      }
      return 'Non assigné'
    },
    isOverCapacity() {
    return this.room.capacity && this.presentStudents.length > this.room.capacity;
  }
  },
  methods: {
    // Vérifie si un étudiant est présent
    isPresentStudent(studentId) {
      return this.presentStudents.some(exam => exam.student === studentId)
    },

    // Charge les détails du local d'examen
    async loadExaminationRoom() {
      try {
        this.examinationRoom = await fetchExaminationRoomById(this.roomId)
        this.room = this.examinationRoom.room
        this.ueCode = this.examinationRoom.event.session_compo.ue
        this.supervisor = this.examinationRoom.supervisor ? this.examinationRoom.supervisor.acro : 'Non assigné'
      } catch (err) {
        this.error = 'Erreur lors du chargement des détails du local: ' + err.message
        console.error('Erreur lors du chargement des détails du local:', err)
      }
    },

    // Charge les étudiants inscrits à l'UE
    async loadStudents() {
      try {
        this.students = await fetchStudentsByUE(this.ueCode)
      } catch (err) {
        this.error = 'Erreur lors du chargement des étudiants: ' + err.message
        console.error('Erreur lors du chargement des étudiants:', err)
      }
    },

    // Charge les présences existantes
    async loadExaminations() {
      try {
        this.presentStudents = await fetchExaminations(this.roomId)
      } catch (err) {
        this.error = 'Erreur lors du chargement des présences: ' + err.message
        console.error('Erreur lors du chargement des présences:', err)
      }
    },

    // Charge les enseignants pour la liste des surveillants
    async loadTeachers() {
      try {
        // Récupérer l'ID de l'événement et le surveillant actuel
        const eventId = this.examinationRoom.event.id;
        const currentSupervisor = this.examinationRoom.supervisor?.acro;

        // Charger les enseignants disponibles
        this.teachers = await fetchAvailableSupervisors(eventId, this.roomId, currentSupervisor);
      } catch (err) {
        this.error = 'Erreur lors du chargement des enseignants: ' + err.message;
        console.error('Erreur lors du chargement des enseignants:', err);
      }
    },

    // Bascule la présence d'un étudiant
    async toggleStudentPresence(studentId) {
      // Si une mise à jour est déjà en cours pour cet étudiant, on ignore le clic
      if (this.updatingStudents.has(studentId)) return
      try {
        // On marque juste cet étudiant comme étant en cours de mise à jour
        this.updatingStudents.add(studentId)

        // Mise à jour optimiste de l'UI avant même que l'appel API soit terminé
        const isAlreadyPresent = this.isPresentStudent(studentId)

        if (isAlreadyPresent) {
          // Retirer optimistiquement l'étudiant de la liste locale
          this.presentStudents = this.presentStudents.filter(exam => exam.student !== studentId)

          // Appel API (sans bloquer l'UI)
          await markStudentAbsent(this.roomId, studentId)
        } else {
          // Simulation temporaire d'un enregistrement pour mise à jour optimiste
          const tempExam = { id: 'temp-' + Date.now(), student: studentId, examination_room: this.roomId }
          this.presentStudents.push(tempExam)

          // Appel API (sans bloquer l'UI)
          const newExamination = await markStudentPresent(this.roomId, studentId)

          // Remplacer l'entrée temporaire par la réelle
          const tempIndex = this.presentStudents.findIndex(exam => exam.id === tempExam.id)
          if (tempIndex !== -1) {
            this.presentStudents[tempIndex] = newExamination
          }
        }
      } catch (err) {
        // En cas d'erreur, restaurer l'état précédent
        if (this.isPresentStudent(studentId)) {
          this.presentStudents = this.presentStudents.filter(exam => exam.student !== studentId)
        } else {
          // Restaurer l'étudiant dans la liste si nécessaire
          const existingExams = await fetchExaminations(this.roomId)
          const studentExam = existingExams.find(exam => exam.student === studentId)
          if (studentExam) {
            this.presentStudents.push(studentExam)
          }
        }

        this.error = 'Erreur lors de la modification de la présence: ' + err.message
        console.error('Erreur lors de la modification de la présence:', err)
      } finally {
        // Retirer l'étudiant de la liste des mises à jour en cours
        this.updatingStudents.delete(studentId)
      }
      // Vérifier si l'ajout dépasserait la capacité

    },

    // Définit ou modifie le surveillant du local
    async defineSupervisor() {
      if (!this.selectedSupervisor) return
      try {
        this.loading = true
        // Mettre à jour le surveillant dans la base de données
        await updateRoomSupervisor(this.roomId, this.selectedSupervisor)
        // Mettre à jour les données localement
        this.examinationRoom.supervisor = this.teachers.find(t => t.acro === this.selectedSupervisor)
        this.supervisor = this.selectedSupervisor
        // Terminer le mode d'édition
        this.editingSupervisor = false
        this.selectedSupervisor = ''
      } catch (err) {
        this.error = 'Erreur lors de la mise à jour du surveillant: ' + err.message
        console.error('Erreur lors de la mise à jour du surveillant:', err)
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    try {
      this.loading = true
      this.error = null

      await this.loadExaminationRoom()
      await this.loadStudents()
      await this.loadExaminations()
      await this.loadTeachers()
    } catch (err) {
      this.error = 'Erreur lors du chargement des données: ' + err.message
      console.error('Erreur lors du chargement des données:', err)
    } finally {
      this.loading = false
    }
  }
}
</script>
