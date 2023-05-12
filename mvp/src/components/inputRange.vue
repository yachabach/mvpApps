<template>
    <div>
        <label for="range">{{ props.label }}</label>
        <div id="range">
            <div class="range-list" 
                     >
                <input 
                    id="lo"
                    type="number"
                    :value="props.rangeLo"
                    class="input-field"
                    min="0" :max="loMax" step="0.1"
                    @change="handleRangeChange"/>
                To 
                <input 
                    class="input-field"
                    id="hi"
                    type="number"
                    :value="props.rangeHi"
                    :min="hiMin" max="10" step="0.1" 
                    @change="handleRangeChange"/>
            </div>
            <span v-if="props.hint" >{{ hint }}</span>
        </div>        
    </div>
</template>

<script setup>
import { computed } from "vue"


const props = defineProps([
    'label',
    'hint',
    'rangeLo',
    'rangeHi'
])

const emit = defineEmits(['updateRange'])

const loMax = computed(() => props.rangeHi)
const hiMin = computed(() => props.rangeLo)

const limitRelative = {
    lo:loValue => (loValue >= props.rangeHi) ? props.rangeHi : loValue,
    hi:hiValue => (hiValue <= props.rangeLo) ? props.rangeLo : hiValue
}

const handleRangeChange = e => {
    const newRange = {
        lo: props.rangeLo,
        hi: props.rangeHi
    }
    console.log('newRange before update: ', newRange)
    newRange[e.target.id] = limitRelative[e.target.id](Number(e.target.value))
    emit('updateRange', newRange)
}

</script>

<style scoped>
.range-list {
    display: flex;
    align-items:center;
    justify-content:space-around;
    gap: 8px;
    border: 1px solid var(--outline);
}

.box {
    border-radius: 4px;
}  

.input-field {
    /* display: block; */
    height: 40px;
    padding: 8px;
    align-items: center;
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);
    background-color: var(--neutral);
    border: none;
    text-align: center;
}


input:focus {
    border: thin var(--outline);
    background-color: var(--outline);
}

input:hover {
    background-color: var(--outline);
}

input:invalid {
    background-color: var(--alertCritical);
}
</style>