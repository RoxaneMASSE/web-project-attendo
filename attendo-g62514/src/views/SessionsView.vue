<template>
  <div class="p-6">
    <Breadcrumb />
    <h1 class="text-2xl font-bold mb-4">Sessions</h1>
    <BaseTable
      :headers="headers"
      :items="sessions"
      :attributes="tableAttributes"
      @action="goToSessionDetails"
      :emptyMessage="'Aucune session trouvée'"
    />
    <!-- Formulaire d'ajout de session -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-4">Ajouter une session</h2>
      <div class="flex space-x-4">
        <input
          v-model="newSessionName"
          type="text"
          placeholder="Nom de la session"
          class="border p-2 flex-grow rounded"
        />
        <button
          @click="addNewSession"
          class="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
        >
          Ajouter
        </button>
      </div>
    </div>


  </div>
</template>

<script>
import BaseTable from '../components/BaseTable.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { fetchSessions, addSession } from '@/services/listSessionService'

export default {
  name: 'SessionsView',
  components: {
    BaseTable,
    Breadcrumb
  },
  data() {
    return {
      sessions: [],
      newSessionName: '',
      headers: ['Nom de la session'],
      tableAttributes: ['label']
    }
  },
  methods: {
    async loadSessions() {
      try {
        this.sessions = await fetchSessions()
      } catch (error) {
        console.error('Erreur de chargement des sessions:', error)
      }
    },
    async addNewSession() {
      if (!this.newSessionName.trim()) return

      try {
        const newSession = await addSession(this.newSessionName)
        this.sessions.push(newSession)
        this.newSessionName = '' // Réinitialiser le champ
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la session:', error)
      }
    },
    goToSessionDetails(session) {
      this.$router.push({
        name: 'session-details',
        params: { id: session.id }
      })
    }
  },
  mounted() {
    this.loadSessions()
  }
}
</script>
