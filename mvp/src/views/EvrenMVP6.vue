<template>
    <div class="canvas">
        <section class="grid-structure">
            <header class="card-area">
                <h1>{{program.programName}}</h1>
                <FileSelector 
                    :fileHandle="programFileHandle" 
                    @fileChosen="handleFileChosen"/> 
            </header>

            <div class="program card-area">
                <FormElement @submit.prevent="handleFormSubmit">
                    <ProgramEditForm />
                </FormElement>
            </div>
            <div class="device card-area input-fields">
                <DeviceManager />
            </div>

        </section>        
    </div>

</template>

<script setup>
import FormElement from '@/components/formElement.vue'
import ProgramEditForm from '@/components/programEditFormContent.vue'
import FileSelector from '@/components/fileSelector.vue'
import DeviceManager from '@/components/deviceManager.vue'
import { useProgramStore } from '@/common/programStore.js'
import { storeToRefs } from 'pinia'
import { ProgramFormFunctions } from '@/composables/programEditButtonFunctions.js'

const { handleSubmit } = ProgramFormFunctions();
const { loadProgramFile } = useProgramStore();
const { program, programFileHandle } = storeToRefs(useProgramStore());

const handleFileChosen = async handle => {
    loadProgramFile(handle)
}

const handleFormSubmit = async e => {
    await handleSubmit[e.submitter.id]()
}

</script>

<style scoped>

.canvas {
    background-color: white;
}

.grid-structure {
    display: grid;
    grid-template-areas: 
        "header header"
        "program device";
    grid-template-rows: 1fr 5fr;
    grid-template-columns: 65% 35%;
    gap: 8px;
    background-color: white;
}

header {
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-area {
    background-color: var(--neutral);
    border-radius: 10px;
    padding: 16px;
}

.program {
    grid-area: program;
}

.device {
    grid-area: device;
}

.submit-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px;
    gap: 16px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

button {
    padding: 4px 12px;
    width: 100px;
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