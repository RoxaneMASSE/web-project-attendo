<template>
  <div class="p-6">
    <div v-if="user">
      <h1 class="text-2xl font-bold mb-4">Bonjour, {{ user.email }}</h1>
      <p class="text-gray-700 mb-4">Vous êtes maintenant connecté. Vous pouvez accéder aux sessions.</p>
    </div>
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">Bienvenue, veuillez vous connecter pour plus de contenu !</h1>
      <p class="text-gray-700 mb-4">Utilisez le bouton "Connexion avec Google" pour accéder à l'application.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'HomeView',

  computed: {
    ...mapState(useAuthStore, ['user'])
  }
}
</script>
