<template>
    <div class="file-selector-element">
        <ProgramElement label="Current File:"
            :informationElement="currentFile">
        </ProgramElement>
        <button 
            class="modal-button"
            id="file-chooser" 
            @click="handleChoose">
                Choose File
            </button>
    </div>

</template>

<script setup>
import { computed } from "vue"
import ProgramElement from '@/components/programElement.vue'

const emit = defineEmits(['fileChosen'])

const props = defineProps(['fileHandle'])

const handleChoose = async () => {
    const [fileHandle] = await window.showOpenFilePicker(); 
    console.log('File Handle Chosen: ', fileHandle)
    if (fileHandle) {emit('fileChosen', fileHandle)}
};

const currentFile = computed(() => props.fileHandle ? props.fileHandle.name : 'No file selected')

</script>

<style scoped>

.file-selector-element {
    width: 300px;
}


.modal-button {
    padding: 4px 0px;
    width: fit-content;
    height: 24px;
    border-radius: 4px;
    color: var(--hyperlink);
    font-size: var(--titleFont);
    font-weight: var(--titleWeight);
    vertical-align: center;
    border: none;
    background: transparent;
    cursor: pointer;
}


</style>