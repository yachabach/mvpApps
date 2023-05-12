<template>
  <div class="container">
    <h3>{{ columnTitle }}</h3>
    <section>
      <div class="elements">
        <slot />

      </div>
    </section>    
  </div>

</template>

<script setup>

const props = defineProps({
    columnTitle: String
})

</script>

<style scoped>

.container {
    margin: 8px;
}

section {
    background-color: var(--surface2);
    padding: 8px;
    border-radius: 5px;
    /* border: 1px solid var(--outline); */
    width: fit-content;
}

.elements {
    /* display: block; */
    display: flex;
    flex-direction: column;
    gap: 8px;
}

</style>