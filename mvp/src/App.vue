<script setup>
import Header from '@/components/productHeader2.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <section>
    <header class="header">
      <Header />
    </header>
    <RouterView />
  </section>
</template>

<style scoped>

</style>
