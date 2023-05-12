<template>
  <section class="section">
    <h1>{{ sectionTitle }}</h1>

    <slot />

  </section>
 
</template>

<script setup>

const props = defineProps({
    sectionTitle: String
})

</script>

<style scoped>
.section {
    padding: 16px;
    margin: 16px;
    border-radius: 10px;
    background-color: var(--surface0);
}

</style>