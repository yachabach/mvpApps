<script setup>
import Header from '@/components/productHeader2.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <section class="canvas">
    <header class="header">
      <Header />
    </header>
    <div class="content">
      <RouterView />
    </div>
  </section>
</template>

<style scoped>
.canvas {
  display: grid;
  grid-template-areas: 
    "header"
    "content";
  grid-template-rows: 68px 1fr;
  height: 100%;
  padding: 16px;
}

.header {
  grid-area: header;
  }

  .content {
    grid-area: content;
  }

</style>
