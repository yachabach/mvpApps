<template>
    <div class="input-fields-rows"  @click="handleOvalClick">
        <ButtonOval
            id="portAuthButton" 
            :config="portAuthButton" 
            :success="props.portAuthorized"/>
        <ButtonOval 
            id="connectButton"
            :disabled="!!(!portAuthorized | buttonsDisabled)"
            :config="connectButton" 
            :success="true"/>
        <ButtonOval 
            id="writeButton"
            :disabled="!!(!portAuthorized | buttonsDisabled)"
            :config="writeButton" 
            :success="true"/>
        <ButtonOval 
            id="deviceLoadButton"
            :disabled="!!(!portAuthorized | buttonsDisabled)"
            :config="deviceLoadButton" 
            :success="true"/>
        <ButtonOval 
            id="resetButton"
            :disabled="!!(!portAuthorized | buttonsDisabled)"
            :config="resetButton" 
            :success="true"/>
        <ButtonOval 
            id="phoneButton"
            :disabled="!!(!portAuthorized | !!buttonsDisabled)"
            :config="phoneButton" 
            :success="true"/>
        </div>
</template>

<script setup>
import ButtonOval from '@/components/buttonOval.vue'
import {portAuthButton, connectButton, writeButton, deviceLoadButton, resetButton, phoneButton} from '@/data/mvpConfig.json'

const props = defineProps({
    buttonsDisabled: Boolean,
    portAuthorized: Boolean
})

const handleOvalClick = e => {
    console.log('detected oval click in deviceCommandButtons.vue: ', e.target.id)
}

</script>

<style>

</style>