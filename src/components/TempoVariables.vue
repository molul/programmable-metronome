<script setup lang="ts">
import { useMetronomeStore } from '../stores/useMetronomeStore'
import Button from './Button.vue'
import Label from './Label.vue'

const store = useMetronomeStore()
const labels = {
  startBpm: 'Start BPM',
  maxBpm: 'Max BPM',
  endBpm: 'Final BPM'
} as const
type BpmKey = keyof typeof labels
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="key in (Object.keys(labels) as BpmKey[])"
      :key="key"
      class="flex items-center justify-between w-full"
    >
      <Label :label="labels[key]" />
      <div class="flex items-center gap-2">
        <Button
          label="-5"
          @click="store.bump(key, -5)"
          :disabled="store.isRunning"
          class="w-14"
        />
        <div class="w-12 text-center text-white">{{ store.config[key] }}</div>
        <Button
          label="+5"
          @click="store.bump(key, 5)"
          :disabled="store.isRunning"
          class="w-14"
        />
      </div>
    </div>
  </div>
</template>
