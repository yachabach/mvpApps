<template>
    <section class="main-screen">
    <div>
        <h1>Com Controls</h1>
        <ComSection />
        <MessageSection />
    </div>
    <div>
        <h1>COM Message Log</h1>
        <div>
            <ul>
                <li v-for="entry in entries" :key="entry">{{ entry }}</li>
            </ul>
        </div>
    </div>        
    </section>
</template>

<script setup>
import { useLogStore } from '@/common/logStore.js'
import { storeToRefs } from 'pinia';
import ComSection from '@/components/comSection.vue'
import MessageSection from '@/components/messageSection.vue'

const logStore = useLogStore()
const { entries } = storeToRefs(logStore)

console.log('Started Main Page')

</script>

<style scoped>

.main-screen {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

</style>