<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-purple-900 text-white p-4">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 class="text-2xl font-bold">Attendo</h1>

        <div class="flex flex-col md:flex-row items-center mt-2 md:mt-0">
          <!-- Navigation -->
          <nav class="mb-2 md:mb-0 md:mr-4">
            <ul class="flex space-x-4">
              <li>
                <router-link to="/" class="hover:text-purple-200">Accueil</router-link>
              </li>
              <li>
                <router-link to="/sessions" class="hover:text-purple-200">Sessions</router-link>
              </li>
              <li>
                <router-link to="/about" class="hover:text-purple-200">À propos</router-link>
              </li>
            </ul>
          </nav>

          <!-- Login Button -->
          <AuthenticateButton/>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <router-view/>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import AuthenticateButton from './components/AuthenticateButton.vue';

export default {
  components: {
    AuthenticateButton
  },
  data() {
    return {
      authStore: useAuthStore()
    };
  },
  computed: {
    user() {
      return this.authStore.user;
    }
  },
  mounted() {
    // Initialiser l'authentification
    this.authStore.init();
  }
}
</script>

<style>

</style>
