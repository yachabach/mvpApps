<template>
  <div>
    <label>{{ label }}</label>
    <div class="input-wrapper">
      <slot :class="align"/>  
    </div>      
  </div>
</template>

<script setup>

const props = defineProps(['label', 'align'])

</script>

<style scoped>
.input-wrapper {
  border: 1px solid var(--outline);
  width: fit-content;
  padding: 4px;
}

.center {
  align-content: center;
}

</style>