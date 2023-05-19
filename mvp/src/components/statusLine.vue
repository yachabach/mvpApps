<template>
  <div v-if="props.success">
    <p><span class="material-icons success">done</span>{{ config.successPhrase }}</p>
    <p></p>
  </div>
  <div v-else>
    <p><span class="material-icons fail">close</span>{{ config.failPhrase }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  config: {
    successPhrase: String,
    failPhrase: String,
  },
  success: ref(false)
})

</script>

<style scoped>
p {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  width: fit-content;
}

</style>