<template>
  <nav class="py-2" aria-label="Fil d'Ariane">
    <ol class="flex items-center space-x-1">
      <li class="inline-flex items-center">
        <router-link to="/" class="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
          Accueil
        </router-link>
      </li>

      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <li class="inline-flex items-center">
          <div class="flex items-center">
            <span class="mx-2 text-gray-400">&gt;</span>
            <router-link
              v-if="index < breadcrumbs.length - 1"
              :to="crumb.path"
              class="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {{ crumb.name }}
            </router-link>
            <span
              v-else
              class="text-sm font-medium text-gray-500"
            >
              {{ crumb.name }}
            </span>
          </div>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumb',
  computed: {
    /**
     * Calcule les éléments du fil d'Ariane en fonction de la route actuelle
     * @returns {Array} Tableau des miettes de pain
     */
    breadcrumbs() {
      const breadcrumbs = [];
      const currentRoute = this.$route;

      // Si la route actuelle est la page d'accueil, ne pas afficher d'autres éléments
      if (currentRoute.path === '/') {
        return breadcrumbs;
      }

      // Si la route a des métadonnées de breadcrumb, les utiliser
      if (currentRoute.name && currentRoute.meta && currentRoute.meta.breadcrumb) {
        // Pour les routes simples comme /sessions
        if (currentRoute.path.split('/').filter(s => s).length === 1) {
          breadcrumbs.push({
            name: currentRoute.meta.breadcrumb,
            path: currentRoute.path
          });
        }
        // Pour les routes imbriquées comme /sessions/1
        else {
          // Trouver la route parent
          const pathParts = currentRoute.path.split('/').filter(s => s);
          let currentPath = '';

          for (const part of pathParts) {
            currentPath += `/${part}`;

            // Trouver la route correspondante
            const matchedRoute = this.$router.options.routes.find(r => {
              // Route exacte
              if (r.path === currentPath) return true;

              // Route avec paramètres
              if (r.path.includes(':')) {
                const routePattern = r.path.replace(/:[^/]+/g, '[^/]+');
                const regex = new RegExp(`^${routePattern}$`);
                return regex.test(currentPath);
              }

              return false;
            });

            if (matchedRoute && matchedRoute.meta && matchedRoute.meta.breadcrumb) {
              // MODIFICATION: Utiliser directement le breadcrumb défini dans la route
              const breadcrumbName = matchedRoute.meta.breadcrumb;

              breadcrumbs.push({
                name: breadcrumbName,
                path: currentPath
              });
            }
          }
        }
      }

      return breadcrumbs;
    }
  }
}
</script>
