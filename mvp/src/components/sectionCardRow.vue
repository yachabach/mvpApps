<template>
  <section class="section">
    <h2 v-if="rowTitle">Program Name: {{ rowTitle }}</h2>
    <div class="elements">
      <slot />

    </div>
  </section>
</template>

<script setup>

const props = defineProps({
    rowTitle: String
})

</script>

<style scoped>
.section {
    background-color: var(--surface2);
    padding: 8px;
    margin: 8px;
    border-radius: 5px;;
}

.elements {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;  
}

</style>