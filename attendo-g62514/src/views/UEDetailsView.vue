<template>
  <div class="p-6">
    <Breadcrumb />
    <h1 class="text-2xl font-bold mb-4">Liste des épreuves de {{ ueCode }} (session : {{ sessionLabel }})</h1>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Chargement des données...</p>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!loading">
      <!-- Liste des épreuves sous forme de carrés comme sur la maquette -->
      <div class="flex flex-wrap gap-4 mb-6">
        <ClickableCard
  v-for="event in events"
  :key="event.id"
  @click="goToEventDetails(event)"
>
  <span class="text-center">{{ event.label }}</span>
</ClickableCard>
      </div>

      <!-- Formulaire d'ajout d'une épreuve -->
      <div class="mt-6">
        <h2 class="text-xl font-semibold mb-4">Ajouter une épreuve</h2>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <span class="mr-2">Intitulé :</span>
            <input
              v-model="newEventLabel"
              type="text"
              placeholder="bilan, projet, examen..."
              class="border p-2 rounded"
            />
          </div>
          <button
            @click="addNewEvent"
            class="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
            :disabled="!newEventLabel.trim()"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb.vue'
import ClickableCard from '../components/ClickableCard.vue'
import { fetchSessionById } from '../services/sessionDetailService'
import { fetchSessionCompo, fetchEvents, addEvent } from '../services/eventService'

export default {
  name: 'UEDetailsView',
  components: {
    Breadcrumb,
    ClickableCard
  },
  data() {
    return {
      sessionLabel: '',
      sessionCompo: null,
      events: [],
      newEventLabel: '',
      loading: true,
      error: null
    }
  },
  computed: {
    ueCode() {
      return this.$route.params.ueCode
    },
    sessionId() {
      return Number(this.$route.params.sessionId)
    }
  },
  methods: {
    // Charger les détails de la session
    async loadSessionDetails() {
      try {
        const session = await fetchSessionById(this.sessionId)
        this.sessionLabel = session.label
      } catch (err) {
        this.error = 'Erreur lors du chargement des détails de la session: ' + err.message
        console.error('Erreur lors du chargement des détails de la session:', err)
      }
    },

    // Charger la composition de session
    async loadSessionCompo() {
      try {
        this.sessionCompo = await fetchSessionCompo(this.sessionId, this.ueCode)
      } catch (err) {
        this.error = 'Erreur lors du chargement de la composition de session: ' + err.message
        console.error('Erreur lors du chargement de la composition de session:', err)
      }
    },

    // Charger les épreuves
    async loadEvents() {
      try {
        if (!this.sessionCompo) {
          this.events = []
          return
        }

        this.events = await fetchEvents(this.sessionCompo.id)
      } catch (err) {
        this.error = 'Erreur lors du chargement des épreuves: ' + err.message
        console.error('Erreur lors du chargement des épreuves:', err)
      }
    },

    // Ajouter une nouvelle épreuve
    async addNewEvent() {
      if (!this.newEventLabel.trim() || !this.sessionCompo) return

      try {
        this.loading = true
        this.error = null

        const newEvent = await addEvent(this.sessionCompo.id, this.newEventLabel.trim())
        this.events.push(newEvent)
        this.newEventLabel = ''
      } catch (err) {
        this.error = 'Erreur lors de l\'ajout de l\'épreuve: ' + err.message
        console.error('Erreur lors de l\'ajout de l\'épreuve:', err)
      } finally {
        this.loading = false
      }
    },

    // Naviguer vers les détails d'une épreuve
    goToEventDetails(event) {
      this.$router.push({
        name: 'event-rooms',
        params: {
          sessionId: this.sessionId,
          ueCode: this.ueCode,
          eventId: event.id
        }
      })
    }
  },
  async mounted() {
    try {
      this.loading = true
      this.error = null

      await this.loadSessionDetails()
      await this.loadSessionCompo()
      await this.loadEvents()
    } catch (err) {
      this.error = 'Erreur lors du chargement des données: ' + err.message
      console.error('Erreur lors du chargement des données:', err)
    } finally {
      this.loading = false
    }
  }
}
</script>
