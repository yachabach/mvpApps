<template>
    <div class="canvas">
        <section class="grid-structure">

            <div class="params card-area">
                <ChooseParams />
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
import ChooseParams from '@/components/chooseParams.vue'
import { ProgramFormFunctions } from '@/composables/programEditButtonFunctions.js'

console.log('starting readDevice.vue')

const { handleSubmit } = ProgramFormFunctions();


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