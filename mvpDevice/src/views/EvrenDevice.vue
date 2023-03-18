<template>
  <section class="app-window">
    <h1>Evren Device</h1>
    <StatusCard />
    <ComSection />    
  </section>

</template>

<script setup>
import ComSection from '@/components/comSection.vue'
import { usePortStore } from '../common/portStore.js';
import StatusCard from '@/components/portStatusCard.vue'

const { initializePort } = usePortStore();

console.log('Starting Device Emulator')
initializePort()

</script>

<style>

</style>