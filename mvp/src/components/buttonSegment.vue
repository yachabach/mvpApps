<template>
    <div class="segment-button">
        <div class="container" 
            :class="[state, config.position]"
            @click="handleInput">
            <span>{{config.label}}</span> 
        </div>
    </div>   
</template>

<script setup>

const props = defineProps({
    config: {
        label: String,
        value: String,
        icon: String,
        position: String,
    },
    state: String
})

const emit = defineEmits(['segmentButtonClick'])

const handleInput = () => {
    console.log('sending: ', props.config.value)
    emit('segmentButtonClick', props.config.value);
}

</script>

<style scoped>
    span {
        display: inline-block;
        padding: 8px;
        font-size: var(--inputTextFont);
        font-weight: var(--inputTextWeight);
    }

    .container {
        box-sizing: border-box;
        border: 1px solid var(--outline);
        width: fit-content;
        min-width: 75px;
        height: 40px;
        font-size: var(--bodyFont);
        font-weight: var(--bodyWeight);
        text-align: center;
    }

    .container:hover {
        outline: 4px solid var(--outline);     
    }

    .end {
        border-radius: 0px 20px 20px 0px;
    }

    .start {
        border-radius: 20px 0px 0px 20px;
    }

    .single {
        border-radius: 20px 20px 20px 20px;
        min-width: 300px;
    }

    .selected {
        background-color: var(--selected-background);
    }

    .none {
        background: none;
    }

</style>