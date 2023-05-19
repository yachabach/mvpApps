<template>
    <section class="input-fields">
        <div class="flex-row ">
            <h1>Read Device Program Settings</h1>
            <span class="material-icons">close</span> 
        </div> 
        <div>
            <div class="input-fields">
                <h3>Parameters</h3>              
                <ul class="flex-list">
                    <li v-for="key in parameterKeys"
                        :key="key" class="inline-labels">
                        <input type="checkbox" :value="key"
                        :id="key" v-model="requestedParameters"/>
                        <label :for="key">{{ selectorLabel(key) }}</label>
                    </li>
                </ul>
            </div>
        </div>         
    </section>

</template>

<script setup>
import { parameterCodes } from '@/defaultConfigs/phoenix100.json'
import { computed, ref } from 'vue'

const parameterKeys = Object.keys(parameterCodes)

console.log('parameter codes: ', parameterCodes)
console.log('parameter codes: ', parameterKeys.value)

const requestedParameters = ref([])
const deviceResponse = {}

const getDeviceResponse = key => Object.keys(deviceResponse).includes(key) ? 
    deviceResponse[key] : ' '

const selectorLabel = computed(() => key => key + ' - ' + getDeviceResponse(key))

</script>

<style scoped>

.flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.flex-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0px 16px;
}

.flex-list label {
    font-size: var(--titleFont);
    font-weight: var(--titleWeight);
}

.inline-labels {
    display: flex;
    justify-content: flex-start;
    gap: 16px;
    align-items: center;
}
</style>