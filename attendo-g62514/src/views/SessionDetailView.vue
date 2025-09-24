<template>
  <div class="p-6">
    <Breadcrumb />
    <h1 class="text-2xl font-bold mb-4">Session {{ session.label || 'Chargement...' }}</h1>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Chargement des données...</p>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <!-- Liste des UEs dans la session -->
      <h2 class="text-xl font-semibold mb-2">UEs évaluées</h2>
      <div v-if="ues.length === 0" class="bg-gray-100 p-4 mb-4 rounded">
        <p class="text-gray-600">Aucune UE n'est associée à cette session.</p>
      </div>
      <BaseTable
        v-else
        :headers="headers"
        :items="ues"
        :attributes="tableAttributes"
        @action="goToUEDetails"
        :emptyMessage="'Aucune UE n\'est associée à cette session.'"
      />

      <!-- Formulaire d'ajout d'UE -->
      <div class="mt-6">
        <h2 class="text-xl font-semibold mb-4">Ajouter une UE dans la session</h2>
        <div v-if="availableUEs.length === 0" class="bg-gray-100 p-4 rounded">
          <p class="text-gray-600">Toutes les UEs sont déjà associées à cette session.</p>
        </div>
        <div v-else class="flex space-x-4">
          <select
            v-model="selectedUE"
            class="border p-2 flex-grow rounded"
          >
            <option value="" disabled selected>Choisissez d'une UE</option>
            <option v-for="ue in availableUEs" :key="ue.ue" :value="ue.ue">
              {{ ue.ue }}
            </option>
          </select>
          <button
            @click="addUE"
            class="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
            :disabled="!selectedUE"
          >
            Ajouter l'UE
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTable from '../components/BaseTable.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { fetchSessionById, fetchSessionUEs, fetchAvailableUEs, addUEToSession } from '../services/sessionDetailService'

export default {
  name: 'SessionDetailView',
  components: {
    BaseTable,
    Breadcrumb
  },
  data() {
    return {
      session: {},
      ues: [],
      availableUEs: [],
      selectedUE: '',
      loading: true,
      error: null,
      headers: ['Code UE'],
      tableAttributes: ['ue']
    }
  },
  computed: {
    sessionId() {
      return Number(this.$route.params.id)
    }
  },
  methods: {
    async loadSession() {
      try {
        this.session = await fetchSessionById(this.sessionId)
      } catch (err) {
        this.error = 'Erreur lors du chargement de la session: ' + err.message
        console.error('Erreur de chargement de la session:', err)
      }
    },
    async loadUEs() {
      try {
        this.ues = await fetchSessionUEs(this.sessionId)
        console.log('UEs chargées:', this.ues)
      } catch (err) {
        this.error = 'Erreur lors du chargement des UEs: ' + err.message
        console.error('Erreur de chargement des UEs:', err)
      }
    },
    async loadAvailableUEs() {
      try {
        this.availableUEs = await fetchAvailableUEs(this.sessionId)
        console.log('UEs disponibles:', this.availableUEs)
      } catch (err) {
        this.error = 'Erreur lors du chargement des UEs disponibles: ' + err.message
        console.error('Erreur de chargement des UEs disponibles:', err)
      }
    },
    goToUEDetails(ue) {
      console.log("UE sélectionnée:", ue)
      this.$router.push({
        name: 'ue-details',
        params: {
          sessionId: this.sessionId,
          ueCode: ue.ue // Utiliser 'ueCode' comme spécifié dans la route
        }
      })
    },
    async addUE() {
      if (!this.selectedUE) return

      try {
        this.loading = true
        this.error = null
        await addUEToSession(this.sessionId, this.selectedUE)

        // Recharger les UEs de la session et les UEs disponibles
        await this.loadUEs()
        await this.loadAvailableUEs()

        // Réinitialiser la sélection
        this.selectedUE = ''
      } catch (err) {
        this.error = 'Erreur lors de l\'ajout de l\'UE: ' + err.message
        console.error('Erreur lors de l\'ajout de l\'UE:', err)
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    try {
      this.loading = true
      this.error = null

      await this.loadSession()
      await this.loadUEs()
      await this.loadAvailableUEs()
    } catch (err) {
      this.error = 'Erreur lors du chargement des données: ' + err.message
      console.error('Erreur lors du chargement des données:', err)
    } finally {
      this.loading = false
    }
  }
}
</script>

