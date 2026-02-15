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
const model = defineModel<MetronomeConfig>();

const presets = reactive<MetronomePreset[]>(
  JSON.parse(localStorage.getItem("metronomePresets") || "[]")
);

function bump(key: keyof MetronomeConfig, delta: number) {
  if (model.value && typeof model.value[key] === "number") {
    const currentValue = model.value[key] as number;
    (model.value[key] as number) = Math.min(
      200,
      Math.max(40, currentValue + delta)
    );
  }
}

function saveConfig() {
  localStorage.setItem("metronomeConfig", JSON.stringify(model.value));
  alert("Configuración guardada.");
}

function loadDefault() {
  const saved = localStorage.getItem("metronomeConfig");
  if (!saved) {
    alert("No hay configuración predeterminada guardada.");
    return;
  }
  try {
    loadPreset(JSON.parse(saved));
  } catch (e) {
    alert("Error al cargar la configuración.");
  }
}

function savePreset() {
  const name = prompt("Nombre del preset:");
  if (!name || !model.value) return;

  const preset: MetronomePreset = {
    name,
    // We save the points array which contains the bar positions
    points: JSON.parse(JSON.stringify(model.value.points)),
    startBpm: model.value.startBpm,
    maxBpm: model.value.maxBpm,
    endBpm: model.value.endBpm,
    stopAtEnd: model.value.stopAtEnd,
    barsPerCell: model.value.barsPerCell,
  };

  presets.push(preset);
  localStorage.setItem("metronomePresets", JSON.stringify(presets));
}

function loadPreset(p: MetronomePreset | MetronomeConfig | undefined) {
  if (!p || !model.value) return;

  // Restore the grid points (the horizontal positions)
  if (p.points) {
    model.value.points = JSON.parse(JSON.stringify(p.points));
  }

  // Restore individual values
  model.value.startBpm = p.startBpm;
  model.value.maxBpm = p.maxBpm;
  model.value.endBpm = p.endBpm;
  model.value.stopAtEnd = p.stopAtEnd;
  model.value.barsPerCell = p.barsPerCell;
}

watch(
  presets,
  () => localStorage.setItem("metronomePresets", JSON.stringify(presets)),
  { deep: true }
);
</script>

<template>
  <div
    v-if="model"
    class="flex w-full flex-col rounded-lg p-4 gap-4 text-sm bg-gray-700 transition-all"
  >
    <TempoVariables :model="model" @bump="(key, delta) => bump(key, delta)" />
    <hr class="border-gray-500" />
    <div class="flex gap-3 flex-wrap items-center rounded">
      <div class="flex gap-2 justify-between w-full items-center">
        <Label label="Bars per cell" />
        <div class="flex gap-2 items-center">
          <Button label="-1" @click="model.barsPerCell--" class="w-14" />
          <div class="w-12 text-center text-white font-bold">
            {{ model.barsPerCell }}
          </div>
          <Button label="+1" @click="model.barsPerCell++" class="w-14" />
        </div>
      </div>
      <label class="flex gap-2 items-center py-2 cursor-pointer">
        <input type="checkbox" v-model="model.stopAtEnd" class="w-4 h-4" />
        <Label label="Stop at end" />
      </label>
    </div>
    <hr class="border-gray-500" />
    <div
      class="flex flex-col lg:flex-row lg:justify-between flex-wrap gap-4 w-full"
    >
      <div class="flex flex-col lg:flex-row gap-4">
        <Button
          icon="solar:diskette-linear"
          label="Save default"
          @click="saveConfig"
        />
        <Button
          icon="solar:restart-linear"
          label="Load default"
          @click="loadDefault"
        />
      </div>
      <div class="flex gap-4 flex-col lg:flex-row">
        <Button
          icon="solar:diskette-linear"
          label="Save new preset"
          @click="savePreset"
        />
        <div
          class="flex gap-2 items-center justify-between flex-grow lg:flex-grow-0"
        >
          <Label label="Load preset" />
          <select
            class="font-bold rounded-md py-2 px-2 bg-white text-black min-w-[200px]"
            @change="
              loadPreset(
                presets[($event.target as HTMLSelectElement).selectedIndex - 1]
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
  </div>
</template>
