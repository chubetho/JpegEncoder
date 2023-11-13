<script setup lang="ts">
const modelValue = defineModel({ default: '' })
</script>

<template>
  <textarea v-model="modelValue" class="w-full flex resize-none border rounded-md px-3 py-2 text-sm text-xl text-black disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" />
</template>
