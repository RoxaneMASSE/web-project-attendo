<template>
  <div
    class="bg-white p-4 shadow rounded w-48 h-48 flex flex-col justify-center items-center cursor-pointer border-2 border-transparent hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
    @click="$emit('click')"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ClickableCard',
  emits: ['click']
}
</script>
