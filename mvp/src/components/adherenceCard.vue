<template>
    <section>
      <SectionCard :sectionTitle="'Adherence and Program Selection'">
        <ProgramElement
          :label="'Adherence Contact:'"
          :informationElement="contactInfo">
        </ProgramElement>
        <FileSelector @fileChosen="handleFileChosen"/>
      </SectionCard>        
    </section>
</template>

<script setup>
import { computed } from 'vue';
import SectionCard from '@/components/sectionCard.vue'
import ProgramElement from '@/components/programElement.vue'
import FileSelector from '@/components/fileSelector.vue'
import { SerialCodes } from '../composables/serialCodes';
import { JsonFunctions } from '../composables/jsonFunctions';

const pf = JsonFunctions()
const dataPaths = SerialCodes().programValuePaths

const contactInfo = computed(()=> {
    let res = 'No program name supplied'
    const name = pf.getValueByPath(dataPaths.adherenceContactName, pf.program)
    const phone = pf.getValueByPath(dataPaths.adherenceContactPhone, pf.program)
    if (name) {
        res = name + ' (' + phone + ')'
    }
    return res
})

const handleFileChosen = fileHandle => {
    
}
</script>

<style>

</style>