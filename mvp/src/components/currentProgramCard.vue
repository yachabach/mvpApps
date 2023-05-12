<template>
    <section>
      <SectionCard :sectionTitle="'Device Program'">
        <SectionCardRow :rowTitle="'Current Program'">
          <FileSelector @fileChosen="handleFileChosen"/>
          <ProgramElement
            :label="'Adherence Contact:'"
            :informationElement="contactInfo">
          </ProgramElement>          
        </SectionCardRow>
        <SectionCardRow :rowTitle="''">
          <ProgramViewer :program="programText"></ProgramViewer>

          <DeviceController :program="programJson"/>
        </SectionCardRow>
      </SectionCard>        
    </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import SectionCard from '@/components/sectionCard.vue'
import SectionCardRow from '@/components/sectionCardRow.vue'
import ProgramElement from '@/components/programElement.vue'
import FileSelector from '@/components/fileSelector.vue'
import ProgramViewer from '@/components/programViewer.vue'
import DeviceController from '@/components/deviceController.vue'
import { SerialCodes } from '../composables/serialCodes';
import { JsonFunctions } from '../composables/jsonFunctions';
import { defaultProgram } from '@/data/mvpConfig.json'

const pf = JsonFunctions()
const dataPaths = SerialCodes().programValuePaths
const programJson = ref(defaultProgram)

const programText = computed(() => JSON.stringify(programJson.value, null, 2))

const contactInfo = computed(()=> {
    let res = 'No program name supplied'
    const name = pf.getValueByPath(dataPaths.adherenceContactName, programJson)
    const phone = pf.getValueByPath(dataPaths.adherenceContactPhone, programJson)
    if (name) {
        res = name + '\n(' + phone + ')'
    }
    return res
})

const handleFileChosen = async fileHandle => {
  const file = await fileHandle.getFile()
  programJson.value = JSON.parse(await file.text())
  console.log('Program JSON: ', programJson.value)
  console.log('Program Text: ', programText.value)
}
</script>

<style scoped>
button{
    display: block;
    margin: 8px 0px;
}
</style>