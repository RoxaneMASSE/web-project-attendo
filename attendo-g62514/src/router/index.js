import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import AboutView from '../views/AboutView.vue'
import supabase from '../services/supabaseService'
import SessionDetailView from '../views/SessionDetailView.vue'
import UEDetailsView from '../views/UEDetailsView.vue'
import EventRoomsView from '../views/EventRoomsView.vue'
import ExaminationView from '../views/ExaminationView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      breadcrumb: 'Accueil'
    }
  },
  {
    path: '/sessions',
    name: 'sessions',
    component: SessionsView,
    meta: {
      requiresAuth: true,
      breadcrumb: 'Sessions'
    }
  },
  {
    path: '/sessions/:id',
    name: 'session-details',
    component: SessionDetailView,
    meta: {
      requiresAuth: true,
      breadcrumb: 'Session'
    }
  },

  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      breadcrumb: 'À propos'
    }
  },
  {
    path: '/sessions/:sessionId/ue/:ueCode',
    name: 'ue-details',
    component: UEDetailsView,
    meta: {
      requiresAuth: true,
      breadcrumb: 'UE'
    }
  },
  {
    path: '/sessions/:sessionId/ue/:ueCode/event/:eventId/rooms',
    name: 'event-rooms',
    component: EventRoomsView,
    meta: {
      requiresAuth: true,
      breadcrumb: 'Locaux'
    }
  },
  {
    path: '/sessions/:sessionId/ue/:ueCode/event/:eventId/rooms/:roomId/examinations',
    name: 'examination',
    component: ExaminationView,
    meta: {
      requiresAuth: true,
      breadcrumb: 'Présences'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      return { name: 'home' }
    }
  }
})

export default router
