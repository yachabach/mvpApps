<template>
  <section>
        <ProgramElement :label="'Current File:'"
            :informationElement="currentFile">
        </ProgramElement>
        <button id="file-chooser" @click="handleChoose">Choose File</button>
  </section>

</template>

<script setup>
import { computed, ref } from "vue"
import ProgramElement from '@/components/programElement.vue'
import { filesystem } from "../composables/filesystem";

const { getNewFileHandle } = filesystem()

const emit = defineEmits(['fileChosen'])

const fileHandle = ref('')

const options = {
  startIn: 'desktop',
  suggestedName: 'test.json',
  types: [
    {
      description: 'Text Files',
      accept: {
        'text/plain': ['.txt'],
      },
    },
    {
      description: 'JSON Files',
      accept: {
        'application/json': ['.json'],
      },
    },
  ],
};

const handleChoose = async () => {
  fileHandle.value = await getNewFileHandle(options); 
  if (fileHandle.value) {
    emit('fileChosen', fileHandle.value)
  }
};

const currentFile = computed(() => fileHandle.value ? fileHandle.value.name : 'No file selected')

</script>

<style scoped>

</style>