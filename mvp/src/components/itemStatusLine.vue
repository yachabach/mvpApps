<template>
  <div v-if="props.success">
    <p><span class="material-icons success">done</span>{{ successPhrase }}</p>
    <p></p>
  </div>
  <div v-else>
    <p><span class="material-icons fail">close</span>{{ failPhrase }}</p>
    <p>{{ remedy }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    success: ref(false),
    successPhrase: String,
    failPhrase: String,
    remedy: String
})

</script>

<style scoped>
p {
    /* padding: 4px; */
    /* margin: 4px; */
    vertical-align: middle;
}

span {
    /* display: inline-block; */
    vertical-align: middle;
}


</style>