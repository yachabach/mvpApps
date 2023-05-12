<template>
    <div>
        <label v-if="labelName" :for="id" :class="type">{{ labelName }}: </label>
        <input 
            :id="id" 
            :type="type" 
            :value="modelValue" 
            @input="handleInput" 
            :class="align"/> 
        <span v-if="error" class="validation-error">{{ error }}</span>
    </div>
</template>

<script setup>

import { ref } from "vue";

const props = defineProps([
    'modelValue',
    'labelName',
    'id',
    'type',
    'error',
    'align'
]);

// const fieldValue = ref(props.modelValue)
// watch(props.modelValue, () => console.log('modelValue changed to: ', props.modelValue))
const emit = defineEmits(['update:modelValue'])

console.log('inputvalue: ', props.modelValue)

const handleInput = e => {
    emit('update:modelValue', e.target.value);
}

</script>

<style scoped>

div {
    white-space: nowrap;

}

input[type=text] {
    width: fit-content;
    height: 40px;
    border: none;
    padding: 4px;
    align-items: center;
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);
}


input[type=text]:focus {
    border: thin var(--outline);
    background-color: var(--primary-light);
}

input[type=text]:hover {
    background-color: var(--primary-light);
}

input[type=checkbox]{
    /* height: 20px;
    width: 20px; */
    vertical-align: middle;
}

/* .checkbox {
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);
} */

.center {
    text-align: center;
}

</style>