// src/stores/authStore.js
import { defineStore } from 'pinia'
import supabase from '../services/supabaseService'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null,
      error: null,
      load: false
    }
  },

  actions: {
    async init() {
      // Vérifier si l'utilisateur est déjà connecté
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        this.user = data.session.user
      }

      // Écouter les changements d'authentification
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          this.user = session.user
        } else if (event === 'SIGNED_OUT') {
          this.user = null
        }
      })
    },

    // Connexion avec Google
    async signIninWithGoogle() {
      this.error = null
      this.load = true

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        })

        if (error) throw error
      } catch (error) {
        this.error = error.message || 'Erreur de connexion'
        console.error('Erreur de connexion:', error)
      } finally {
        this.load = false
      }
    },

    // Déconnexion
    async signOut() {
      this.load = true
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        this.user = null
      } catch (error) {
        this.error = error.message || 'Erreur de déconnexion'
        console.error('Erreur de déconnexion:', error)
      } finally {
        this.load = false
      }
    }
  }
})
