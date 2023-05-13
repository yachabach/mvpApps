<template>
    <div>
        <div>
            <label for="buttons">{{ label }}</label>
        </div>
        <div class="segment-button" :class="{vertical: vertical}" id="buttons">
            <ButtonSegment 
                v-for="btn in segmentButtons"
                :key="btn.value"
                :config="btn"
                :state="(modelValue === btn.value) ? 'selected' : 'none'"
                @segmentButtonClick="handleSegmentEmit"/>
        </div>
    </div>
  
</template>

<script setup>
import ButtonSegment from '@/components/buttonSegment.vue'
import { computed } from 'vue'

const props = defineProps([
    'label',
    'segmentButtons',
    'modelValue',
])

const emit = defineEmits(['update:modelValue'])
    
const vertical = computed(()=>props.segmentButtons[0].position === 'top')

const handleSegmentEmit = e => {
    emit('update:modelValue', e);
}
</script>

<style scoped>
    .segment-button {
        display: flex;
    }

    .vertical {
        flex-direction: column;
    }

</style>