<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-purple-900">À propos</h1>

    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-purple-800">Présentation du projet</h2>
      <p class="text-gray-700 mb-4">
        Attendo est une application de gestion de présence développée pour faciliter le suivi des participants lors des sessions d'examens.
        Cette application permet aux enseignants de gérer les locaux, les surveillants et les présences des étudiants de manière intuitive et efficace.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-purple-800">Informations</h2>

        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-800">Auteur</h3>
          <p class="text-gray-700">Masse Roxane (g62514)</p>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-800">Année scolaire</h3>
          <p class="text-gray-700">2024-2025</p>
        </div>

        <div>
          <h3 class="text-lg font-medium text-gray-800">Cours</h3>
          <p class="text-gray-700">4WEB3D - Développement WEB 3</p>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-purple-800">Technologies utilisées</h2>

        <ul class="space-y-2">
          <li class="flex items-center">
            <div class="bg-green-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-gray-700"><strong>Vue.js 3</strong> - Framework JavaScript progressif</span>
          </li>
          <li class="flex items-center">
            <div class="bg-green-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-gray-700"><strong>Tailwind CSS</strong> - Framework CSS utilitaire</span>
          </li>
          <li class="flex items-center">
            <div class="bg-green-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-gray-700"><strong>Supabase</strong> - Plateforme backend-as-a-service</span>
          </li>
          <li class="flex items-center">
            <div class="bg-green-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-gray-700"><strong>Pinia</strong> - Bibliothèque de gestion d'état</span>
          </li>
          <li class="flex items-center">
            <div class="bg-green-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-gray-700"><strong>Vue Router</strong> - Routage officiel pour Vue.js</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>
