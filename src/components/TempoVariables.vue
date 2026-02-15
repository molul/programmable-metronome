<script setup lang="ts">
import type { MetronomeConfig } from "../assets/types";
import Button from "./Button.vue";
import Label from "./Label.vue";

interface Props {
  model: MetronomeConfig;
  isRunning: boolean;
}

const props = defineProps<Props>();

// Only the keys we want to display
const labels = {
  startBpm: "Start BPM",
  maxBpm: "Max BPM",
  endBpm: "Final BPM",
} as const;

type BpmKey = keyof typeof labels; // 'startBpm' | 'maxBpm' | 'endBpm'

const emit = defineEmits<{
  (e: "bump", key: BpmKey, delta: number): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="key in Object.keys(labels) as BpmKey[]"
      :key="`bpmVariable-${key}`"
      class="flex items-center justify-between gap-2 w-full"
    >
      <Label :label="labels[key]" />

      <div class="flex items-center gap-2">
        <Button
          label="-5"
          @click="emit('bump', key, -5)"
          class="w-14"
          :disabled="props.isRunning"
        />
        <div class="w-12 text-center">
          {{ props.model[key] }}
        </div>
        <Button
          label="+5"
          @click="emit('bump', key, 5)"
          class="w-14"
          :disabled="props.isRunning"
        />
      </div>
    </div>
  </div>
</template>
