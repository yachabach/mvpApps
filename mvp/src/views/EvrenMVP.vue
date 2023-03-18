<template>
  <section>
    <h1>Evren MVP Device Loader - Active: unknown</h1>
      <FileSelector />
      <p></p>
      <ComSection />
      <MessageSection />   
      <p></p>
  </section>
</template>

<script setup>
import FileSelector from '@/components/fileSelector.vue'
import ComSection from '@/components/comSection.vue'
import MessageSection from '@/components/messageSection.vue'
import { usePortStore } from '../common/portStore.js';

const { initializePort } = usePortStore()

console.log('Starting EvrenMVP')
initializePort()

</script>

<style>

.main-foundation {
  max-width: 800px;
  margin: 0px auto;
  padding: 16px;
}

.pickers {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

</style>