<template>
  <div class="bg-white shadow-md rounded">
    <table class="w-full">
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            class="px-4 py-2 text-left text-gray-600 font-semibold"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
          class="border-b"
          :class="getRowClass(item)"
          @click="rowClick ? emitAction(item) : null"
        >
          <td
            v-for="(attr, attrIndex) in attributes"
            :key="attrIndex"
            class="px-4 py-2"
            :class="{
              'text-center': centerText,
              'cursor-pointer text-purple-900': !rowClick,
              'hover:bg-purple-100 hover:rounded': !rowClick
            }"
            @click="!rowClick ? emitAction(item) : null"
          >
            <div class="py-1 px-2 rounded">{{ getNestedValue(item, attr) }}</div>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="items.length === 0"
      class="text-center py-4 text-gray-500"
    >
    {{ emptyMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    attributes: {
      type: Array,
      required: true
    },
    actionLabel: {
      type: String,
      default: 'Actions'
    },
    emptyMessage: {
      type: String,
      default: 'Aucune donnée trouvée'
    },
    rowClick: {
      type: Boolean,
      default: false
    },
    centerText: {
      type: Boolean,
      default: true
    },
    rowClassFunction: {
      type: Function,
      default: () => ''
    },
    actionIdField: {
      type: String,
      default: null
    }
  },
  emits: ['action'],
  methods: {
    getNestedValue(item, path) {
      if (!path.includes('.')) {
        return item[path];
      }

      return path.split('.').reduce((obj, key) => {
        return obj && obj[key] !== undefined ? obj[key] : null;
      }, item);
    },
    emitAction(item) {
      if (this.actionIdField) {
        // Émet seulement l'ID au lieu de l'objet complet
        const id = this.getNestedValue(item, this.actionIdField);
        this.$emit('action', id);
      } else {
        // Comportement standard, émettant l'objet complet
        this.$emit('action', item);
      }
    },
    getRowClass(item) {
      return this.rowClassFunction(item);
    }
  }
}
</script>
