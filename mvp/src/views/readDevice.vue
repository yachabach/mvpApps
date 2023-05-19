<template>
    <div class="canvas">
        <section class="grid-structure">

            <div class="params card-area">
                <DeviceManager />
            </div>

            <div class="program card-area">
                <FormElement 
                    @submit.prevent="handleFormSubmit"
                    :buttonList="['cancel', 'save']">
                    <ProgramEditForm />
                </FormElement>
            </div>

        </section>        
    </div>

</template>

<script setup>
import FormElement from '@/components/formElement.vue'
import ProgramEditForm from '@/components/deviceProgramFormContent.vue'
import { useRouter } from 'vue-router'
import DeviceManager from '@/components/deviceManager.vue'
import { useProgramStore } from '@/common/programStore.js'
import { storeToRefs } from 'pinia'
import { ProgramFormFunctions } from '@/composables/programEditButtonFunctions.js'

const { handleSubmit } = ProgramFormFunctions();
const { loadProgramFile } = useProgramStore();
const { program, programFileHandle } = storeToRefs(useProgramStore());
const router = useRouter()
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
        "device program";
    grid-template-columns: 35% 65%;
    gap: 8px;
    background-color: white;
}

.program {
    grid-area: program;
}

.params {
    grid-area: device;
}

</style>