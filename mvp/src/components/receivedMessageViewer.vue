<template>
  <section>
    <SectionCardColumn :columnTitle="'Message from device...'">
        <textarea id="deviceMsgs" cols="30" rows="10"
            v-model="hexMessageString"></textarea>
    </SectionCardColumn>
  </section>
</template>

<script setup>
import SectionCardColumn from '@/components/sectionCardColumn.vue'
import { computed, ref } from 'vue'

const props = defineProps({
    messages: undefined
})

const msgs = ref(props.messages)

const hexMessageString = computed(() => {
    let hexString = ''
    props.messages.forEach(n => {
        hexString += n.toString(16) + ' '
    })
    return hexString
})

</script>

<style scoped>
ul {
    padding-inline-start: 0px;
}
</style>