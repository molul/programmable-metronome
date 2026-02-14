<script setup lang="ts">
import type { Ref } from "vue";
import type { MetronomePreset } from "../assets/types";

interface Props {
  presets: MetronomePreset[] | Ref<MetronomePreset[]>;
  onSaveConfig: () => void;
  onSavePreset: () => void;
  onLoadPreset: (preset: MetronomePreset | undefined) => void;
}

const props = defineProps<Props>();

function handleChange(e: Event) {
  const select = e.target as HTMLSelectElement;
  const index = select.selectedIndex - 1; // first option is placeholder
  props.onLoadPreset(props.presets.value[index]);
}
</script>

<template>
  <div class="flex gap-2 mt-2">
    <button class="border px-2 py-1" @click="props.onSaveConfig">
      Guardar Configuración
    </button>
    <button class="border px-2 py-1" @click="props.onSavePreset">
      Guardar Preset
    </button>
    <select class="border px-1" @change="handleChange">
      <option disabled selected>Seleccionar preset</option>
      <option v-for="p in props.presets.value" :key="`preset-${p.name}`">
        {{ p.name }}
      </option>
    </select>
  </div>
</template>
