<script setup lang="ts">
import { ref, type Ref } from "vue";
import MetronomeControls from "./MetronomeControls.vue";
import type { MetronomeConfig } from "../assets/types";
import Button from "./Button.vue";

interface Props {
  isRunning: Ref<boolean>;
}

const props = defineProps<Props>();

const menuVisible = ref(false);
const model = defineModel<MetronomeConfig>();
</script>

<template>
  <div class="flex flex-col gap-0 p-4 relative z-50 bg-gray-800 rounded-t-lg">
    <div class="flex justify-between items-center z-50">
      <span class="text-xl lg:text-2xl font-bold">Speed Builder Metronome</span>
      <Button
        type="text"
        size="big"
        :icon="
          menuVisible ? 'majesticons:close-line' : 'solar:hamburger-menu-linear'
        "
        @click="menuVisible = !menuVisible"
      />
    </div>

    <MetronomeControls
      v-if="menuVisible"
      v-model="model"
      :is-running="props.isRunning"
    />
  </div>
</template>
