<template>
  <section class="card-foundation">
    <span>
        <button class="button-list" @click="handleConnectPort">Connect Port</button>
        {{ portOpenStatus }}
    </span>
  </section>
</template>

<script setup>
import { usePortStore } from '../common/portStore.js'
import { storeToRefs } from 'pinia'

const { portOpenStatus } = storeToRefs(usePortStore())
const { changeActivePort } = usePortStore()

const handleConnectPort = () => {
    changeActivePort()
}
</script>

<style>

</style>