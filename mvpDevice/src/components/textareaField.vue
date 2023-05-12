<template>
    <div>
        <label v-if="label" 
            :for="id" :class="type">
            {{ label }}: 
        </label>
        <textarea 
            :id="id"
            :class="classList"
            readonly="true"></textarea>
    </div>
</template>

<script setup>

const props = defineProps([
    'modelValue',
    'label',
    'id',
    'hint',
    'classList',
    'rows', 'cols',
]);

console.log('rows/cols: ', props.rows, ' / ', props.cols)

const emit = defineEmits(['update:modelValue'])

const handleInput = e => {
    emit('update:modelValue', e.target.value);
}

</script>

<style scoped>
label {
    display: block;
}

input:focus {
    border: thin var(--outline);
    background-color: var(--outline);
}

input:hover {
    background-color: var(--outline);
}

.box {
    border: 1px solid var(--outline);
    border-radius: 4px;
}

.line {
    border-bottom: 1px solid var(--outline);
}

</style>