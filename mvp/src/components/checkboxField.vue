<template>
    <div>
        <input 
            :id="id" type="checkbox" 
            :checked="modelValue" 
            @input="handleInput"
            :class="classList"
            :value="value"
        />
        <label :for="id">{{ labelEnd }}</label>
        <p v-if="error" class="validation-error">{{ error }}</p>
        <p v-if="hint" >{{ hint }}</p>
    </div>
</template>

<script setup>

const props = defineProps([
    'modelValue',
    'labelEnd',
    'id',
    'error',
    'hint',
    'classList',
    'value',
]);

const emit = defineEmits(['update:modelValue'])

const handleInput = e => {
    emit('update:modelValue', e.target.checked);
}

</script>

<style scoped>
label {
    display: block;
}

input {
    /* display: block; */
    height: 40px;
    padding: 8px;
    align-items: center;
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);
    background-color: var(--neutral);
    border: none;
}

input:focus {
    border: thin var(--outline);
    background-color: var(--outline);
}

input:hover {
    background-color: var(--outline);
}

input[type=checkbox] {
    vertical-align: middle;
    display: inline-block;
    height: 20px;
    width: 20px;
    accent-color: var(--selected-background);
}

input[type=checkbox]:hover {
    outline: 4px solid var(--outline);
    accent-color: var(--primary-light);
}

input[type=checkbox] + label {
    display: inline-block;
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);
    padding-left: 8px;
}


/* 
input:invalid + span::after {
  content: "✖";
  padding-left: 5px;
}

input:valid + span::after {
  content: "✓";
  padding-left: 5px;
} */

.box {
    border: 1px solid var(--outline);
    border-radius: 4px;
}

.line {
    border-bottom: 1px solid var(--outline);
}

.center {
    text-align: center;
}
</style>