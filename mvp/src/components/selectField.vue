<template>
    <div>
        <div>
            <label for="select">{{ label }}</label>
        </div>
        <div>
            <select :value="modelValue" @change="handleChoice">
                <option class="optionText"
                    v-for="item in optionList" 
                    :value="item"
                    :key="item">{{ item }}</option>
            </select>
        </div>
    </div>
  
</template>

<script setup>

const props = defineProps([
    'label',
    'optionList',
    'modelValue',
])

const emit = defineEmits(['update:modelValue'])
    
const handleChoice = e => {
    emit('update:modelValue', e.target.value);
}
</script>

<style scoped>
select {
    /* display: block; */
    height: 40px;
    padding: 8px;
    align-items: center;
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);
    background-color: var(--neutral);
    border: none;
}

select:focus {
    border: thin var(--outline);
    background-color: var(--outline);
}

select:hover {
    background-color: var(--outline);
}

.optionText {
    font-weight: var(--inputTextWeight);
    font-size: var(--inputTextFont);    
}

</style>