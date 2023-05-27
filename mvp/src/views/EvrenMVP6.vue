<template>
    <div class="canvas">
        <section class="grid-structure">
            <header class="card-area header-area">
                <h1>{{program.programName}}</h1>
                <FileSelector 
                    :fileHandle="programFileHandle" 
                    @fileChosen="handleFileChosen"/> 
            </header>

            <div class="program card-area">
                <FormElement 
                    @submit.prevent="handleFormSubmit"
                    :buttonList="['cancel', 'saveAs', 'save']">
                    <ProgramEditForm />
                </FormElement>
            </div>
            <div class="device card-area">
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

//TODO: Refactor - no return value and has side-effects
const handleFileChosen = async handle => await loadProgramFile(handle)

const handleFormSubmit = async e => {
    await handleSubmit[e.submitter.id](program.value, programFileHandle.value)
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

.header-area {
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.program {
    grid-area: program;
}

.device {
    grid-area: device;
}

</style>