<script setup lang="ts">
const modelValue = defineModel({ default: '' })
</script>

<template>
  <input
    v-model="modelValue"
    type="text"
    class="border-input bg-primary-foreground ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground h-10 w-full flex border rounded-md px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    autocomplete="off"
  >
</template>
