<script setup lang="ts">
import { reactive, watch, type Ref } from "vue";
import type { MetronomeConfig, MetronomePreset } from "../assets/types";
import TempoVariables from "./TempoVariables.vue";
import Button from "./Button.vue";
import Label from "./Label.vue";

interface Props {
  isRunning: Ref<boolean>;
}

const props = defineProps<Props>();

// Tell defineModel the type explicitly
const model = defineModel<MetronomeConfig>();

// Presets array
const presets = reactive<MetronomePreset[]>(
  JSON.parse(localStorage.getItem("metronomePresets") || "[]")
);

// Increment / decrement a BPM value
function bump(key: keyof MetronomeConfig, delta: number) {
  if (model.value && typeof model.value[key] === "number") {
    // We cast to 'any' or 'number' here because the check above
    // already proved it's safe for us humans.
    const currentValue = model.value[key] as number;
    (model.value[key] as number) = Math.min(
      200,
      Math.max(40, currentValue + delta)
    );
  }
}

// Save config
function saveConfig() {
  localStorage.setItem("metronomeConfig", JSON.stringify(model.value));
  alert("Configuración guardada.");
}

// Save preset
function savePreset() {
  const name = prompt("Nombre del preset:");
  if (!name) return;

  // Copy all required fields with defaults
  const preset: MetronomePreset = {
    startBpm: model.value?.startBpm ?? 100,
    maxBpm: model.value?.maxBpm ?? 140,
    endBpm: model.value?.endBpm ?? 115,
    stopAtEnd: model.value?.stopAtEnd ?? false,
    barsPerCell: model.value?.barsPerCell ?? 1,
    name,
  };

  presets.push(preset);
  localStorage.setItem("metronomePresets", JSON.stringify(presets));
}

// Load preset
function loadPreset(p: MetronomePreset | undefined) {
  if (!p) return;
  if (model.value) {
    model.value.startBpm = p.startBpm;
    model.value.maxBpm = p.maxBpm;
    model.value.endBpm = p.endBpm;
    model.value.stopAtEnd = p.stopAtEnd;
    model.value.barsPerCell = p.barsPerCell;
  }
}

// Watch presets to save changes
watch(
  presets,
  () => localStorage.setItem("metronomePresets", JSON.stringify(presets)),
  { deep: true }
);
</script>

<template>
  <div
    v-if="model"
    class="flex w-full flex-col rounded-lg p-3 gap-4 text-sm absolute top-12 left-0 z-50 bg-gray-600"
  >
    <TempoVariables :model="model" @bump="(key, delta) => bump(key, delta)" />

    <hr />

    <div class="flex gap-3 flex-wrap items-center rounded">
      <div class="flex gap-2 justify-between w-full items-center">
        <Label label="Bars per cell" />
        <input
          type="number"
          v-model.number="model.barsPerCell"
          class="border w-20 px-1 py-2 rounded-md"
        />
      </div>

      <label class="flex gap-2 items-center py-2">
        <input type="checkbox" v-model="model.stopAtEnd" />
        <Label label="Stop at end" />
      </label>
    </div>

    <hr />

    <div class="flex flex-col lg:flex-row flex-wrap gap-3 w-full">
      <Button label="Save default" @click="saveConfig" />

      <Button label="Save preset" @click="savePreset" />

      <div class="flex gap-2 items-center justify-between">
        <Label label="Load preset" />
        <select
          class="font-bold rounded-md py-2 bg-white text-black hover:bg-blue-500 active:bg-blue-600 transition-colors min-w-[200px]"
          @change="
            loadPreset(
              presets[($event.target as HTMLSelectElement)?.selectedIndex - 1]
            )
          "
        >
          <option disabled selected>-</option>
          <option v-for="p in presets" :key="`preset-${p.name}`">
            {{ p.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
