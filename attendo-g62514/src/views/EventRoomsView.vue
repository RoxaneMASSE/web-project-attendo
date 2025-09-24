<template>
  <div class="p-6">
    <Breadcrumb />
    <h1 class="text-2xl font-bold mb-4">Liste des locaux pour {{ event.label || 'Chargement...' }} - {{ ueCode }}</h1>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Chargement des données...</p>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="!loading">
      <!-- Afficher les locaux alloués dans un wrapper flex -->
      <div class="flex flex-wrap gap-4 mb-6">
        <ClickableCard
          v-for="room in examinationRooms"
          :key="room.id"
          @click="goToExamination(room.id)"
        >
          <div class="text-center font-bold text-lg">{{ room.room.label }}</div>
          <div class="text-center text-sm border-t border-b py-2">
            <div class="flex justify-center items-center">
              <span
                :class="{'text-red-600 font-bold': isRoomOverCapacity(room), 'text-gray-700': !isRoomOverCapacity(room)}"
                class="mr-1"
              >
                {{ getStudentPresentCount(room.id) }}
              </span>
              <span>/</span>
              <span class="text-gray-700 ml-1">{{ room.room.capacity }}</span>
            </div>
            <div v-if="isRoomOverCapacity(room)" class="text-yellow-700 text-xs mt-1">
              Capacité dépassée!
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm font-semibold">Surveillant</div>
            <div class="text-sm">{{ room.supervisor ? room.supervisor.acro : 'Non assigné' }}</div>
          </div>
        </ClickableCard>
      </div>


      <!-- Formulaire d'ajout de local -->
      <div class="mt-6">
        <h2 class="text-xl font-semibold mb-4">Ajouter un local</h2>
        <div class="flex space-x-4">
          <select
            v-model="selectedRoom"
            class="border p-2 rounded"
          >
            <option value="" disabled selected>Choisissez un local</option>
            <option v-for="room in availableRooms" :key="room.label" :value="room.label">
              {{ room.label }} (capacité: {{ room.capacity }})
            </option>
          </select>
          <button
            @click="addRoom"
            class="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
            :disabled="!selectedRoom"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb.vue'
import ClickableCard from '../components/ClickableCard.vue'
import { fetchEventById } from '../services/eventService'
import { fetchEventRooms, fetchAvailableRooms, addRoomToEvent } from '../services/examinationRoomService'
import { fetchExaminations } from '../services/examinationService'

export default {
  name: 'EventRoomsView',
  components: {
    Breadcrumb,
    ClickableCard
  },
  data() {
    return {
      event: {},
      examinationRooms: [],
      availableRooms: [],
      teachers: [],
      selectedRoom: '',
      loading: true,
      error: null,
      roomPresenceCounts: {}
    }
  },
  computed: {
    eventId() {
      return Number(this.$route.params.eventId)
    },
    ueCode() {
      return this.$route.params.ueCode
    },
    sessionId() {
      return Number(this.$route.params.sessionId)
    }
  },
  methods: {
    // Charger les détails de l'épreuve
    async loadEventDetails() {
      try {
        this.event = await fetchEventById(this.eventId)
      } catch (err) {
        this.error = 'Erreur lors du chargement des détails de l\'épreuve: ' + err.message
        console.error('Erreur lors du chargement des détails de l\'épreuve:', err)
      }
    },

    // Charger les locaux alloués à l'épreuve
    async loadExaminationRooms() {
      try {
        this.examinationRooms = await fetchEventRooms(this.eventId)
      } catch (err) {
        this.error = 'Erreur lors du chargement des locaux: ' + err.message
        console.error('Erreur lors du chargement des locaux:', err)
      }
    },

    // Charger les locaux disponibles
    async loadAvailableRooms() {
      try {
        this.availableRooms = await fetchAvailableRooms(this.eventId)
      } catch (err) {
        this.error = 'Erreur lors du chargement des locaux disponibles: ' + err.message
        console.error('Erreur lors du chargement des locaux disponibles:', err)
      }
    },

    // Charger les présences pour tous les locaux
    async loadAllExaminations() {
      try {
        for (const room of this.examinationRooms) {
          const examinations = await fetchExaminations(room.id)
          this.roomPresenceCounts[room.id] = examinations.length
        }
      } catch (err) {
        this.error = 'Erreur lors du chargement des présences: ' + err.message
        console.error('Erreur lors du chargement des présences:', err)
      }
    },

    getStudentPresentCount(roomId) {
      return this.roomPresenceCounts[roomId] || 0
    },


    // Ajouter un local à l'épreuve
    async addRoom() {
      if (!this.selectedRoom) return

      try {
        this.loading = true
        this.error = null

        await addRoomToEvent(
          this.eventId,
          this.selectedRoom,
          null
        )

        // Recharger les données
        await this.loadExaminationRooms()
        await this.loadAvailableRooms()

        // Réinitialiser les sélections
        this.selectedRoom = ''

      } catch (err) {
        this.error = 'Erreur lors de l\'ajout du local: ' + err.message
        console.error('Erreur lors de l\'ajout du local:', err)
      } finally {
        this.loading = false
      }
    },

    goToExamination(roomId) {
      this.$router.push({
        name: 'examination',
        params: {
          sessionId: this.sessionId,
          ueCode: this.ueCode,
          eventId: this.eventId,
          roomId: roomId
        }
      })
    },
    isRoomOverCapacity(room) {
    const count = this.getStudentPresentCount(room.id);
    return room.room.capacity && count > room.room.capacity;
  }
  },
  async mounted() {
    try {
      this.loading = true
      this.error = null

      await this.loadEventDetails()
      await this.loadExaminationRooms()
      await this.loadAvailableRooms()
      await this.loadAllExaminations()
    } catch (err) {
      this.error = 'Erreur lors du chargement des données: ' + err.message
      console.error('Erreur lors du chargement des données:', err)
    } finally {
      this.loading = false
    }
  }
}
</script>
