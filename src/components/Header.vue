<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from "vue";
import MetronomeControls from "./MetronomeControls.vue";
import type { MetronomeConfig } from "../assets/types";
import Button from "./Button.vue";

interface Props {
  isRunning: Ref<boolean>;
}

const props = defineProps<Props>();
const menuVisible = ref(false);
const model = defineModel<MetronomeConfig>();

// 1. Create a ref for the element we want to track
const containerRef = ref<HTMLElement | null>(null);

// 2. Logic to detect clicks outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    menuVisible.value &&
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    menuVisible.value = false;
  }
};

// 3. Setup/Teardown listeners
onMounted(() => {
  window.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div
    ref="containerRef"
    class="flex flex-col gap-0 p-4 relative z-50 bg-gray-800 rounded-t-lg"
  >
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
