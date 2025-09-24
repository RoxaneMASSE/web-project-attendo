<template>
  <div>
    <!-- Bouton de connexion -->
    <button
      v-if="!user"
      @click="signInWithGoogle"
      class="bg-white text-purple-900 px-4 py-1 rounded font-medium hover:bg-gray-100 flex items-center"
      :disabled="load"
    >
      <svg
        v-if="load"
        class="animate-spin h-4 w-4 text-purple-600 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      {{ load ? 'Connexion...' : 'Connexion' }}
    </button>

    <!-- Bouton de déconnexion -->
    <button
      v-else
      @click="signOut"
      class="bg-white text-purple-900 px-4 py-1 rounded font-medium hover:bg-gray-100 flex items-center cursor-pointer"
      :disabled="load"
    >
      <svg
        v-if="load"
        class="animate-spin h-4 w-4 text-purple-600 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      {{ load ? 'Déconnexion...' : 'Déconnexion' }}
    </button>

    <!-- Message d'erreur -->
    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'AuthButton',
  data() {
    return {
      authStore: useAuthStore()
    };
  },
  computed: {
    user() {
      return this.authStore.user;
    },
    error() {
      return this.authStore.error;
    },
    load() {
      return this.authStore.load;
    }
  },
  methods: {
    signInWithGoogle() {
      this.authStore.signIninWithGoogle();
    },
    signOut() {
      this.authStore.signOut();
      this.$router.push('/');
    }
  },
  mounted() {
    this.authStore.init();
  }
};
</script>
