<template>
  <section>
    <SectionCardRow :rowTitle="'ProgramParameters'">
        <form @submit="handleSubmit">
            <textarea name="programView" cols="40" rows="15"
                v-model="programView"></textarea>   
            <div class="row-button-list">
                <button type="submit" id="save">Save</button>     
                <button type="submit" id="saveAs">Save As</button>     
                <button type="submit" id="cancel">Cancel</button>            
            </div>
        </form>    
    </SectionCardRow>


  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import SectionCardRow from '@/components/sectionCardRow.vue'


const props = defineProps(['program'])

const programView = computed(() => props.program)

const handleSubmit = e => {
    e.preventDefault()
    console.log('Event Object: ', e)
    console.log('Save submit: ', e.submitter.id === 'saveAs')
}

</script>

<style scoped>

textarea {
    white-space: pre-wrap;
}

.row-button-list {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}


</style>