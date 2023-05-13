<template>
    <section>
        <FormElement>
            <ProgramEditForm :program="program" @change="handleElementChange"/>
        </FormElement>
    </section>
  
</template>

<script setup>
import FormElement from '@/components/formElement.vue'
import ProgramEditForm from '@/components/programEditFormContent.vue'
import { useProgramStore } from '@/common/programStore.js'

import phoenix100 from '@/defaultConfigs/phoenix100.json'
import { JsonFunctions } from '@/composables/jsonFunctions';
import programKeywords from '@/defaultConfigs/programElementRequirements.json';


    const { deepHasKey } = JsonFunctions()

    console.log('programKeywords: ', programKeywords)

    const requiredKeys = programKeywords.concat(Object.keys(phoenix100.parameterCodes))
console.log('requiredKeys: ', requiredKeys)
// 
const {currentProgram} = useProgramStore()
// const {currentProgram} = storeToRefs(useProgramStore())

console.log('Current Program is: ', currentProgram)

const program = {
    programName: 'Test Name',
    contact: {name: 'Dave', phone: '12345'},
    outletPort: 'both',
    programLength: '00:30:00'
}

const handleElementChange = e => {
    console.log('Change event: ', e)
    console.log('elementUpdated: ', 
        {
            field: e.target.id,
            value: e.target.value
        })
}

</script>

<style scoped>

section {
    background-color: var(--neutral);
    height: 100%;
    border-radius: 20px;
}

</style>