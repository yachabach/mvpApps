<template>
    <header>
        <img src="/EvrenPhoenixProduct.png" alt="Phoenix Product Logo">
        <ProgramElement 
            :label="'Program Contact'"
            :informationElement="contact" />
        <FileSelector @fileChosen="handleFileChosen"/>
        <img src="/EvrenLogo.png" alt="Evren Logo">
    </header>
</template>

<script setup>
import ProgramElement from '@/components/programElement.vue'
import FileSelector from '@/components/fileSelector.vue'

const emit = defineEmits(['fileChosen'])

const props = defineProps(['contact'])

const handleFileChosen = fileHandle => {
    emit('fileChosen', fileHandle)
}

</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    gap: 16px;
    background-color: var(--surface0);
    align-content: center;
}
</style>