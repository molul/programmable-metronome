<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import MetronomeGrid from "./MetronomeGrid.vue";
import {
  type TempoPoint,
  useMetronomeEngine,
} from "../composables/useMetronomeEngine";
import Button from "./Button.vue";
import Header from "./Header.vue";

const cfg = reactive({
  startBpm: 100,
  maxBpm: 140,
  endBpm: 115,
  stopAtEnd: true,
  barsPerCell: 1,
});

const points = ref<[TempoPoint, TempoPoint, TempoPoint]>([
  { bar: 0, bpm: cfg.startBpm },
  { bar: 8, bpm: cfg.maxBpm },
  { bar: 12, bpm: cfg.endBpm },
]);

onMounted(() => {
  const saved = localStorage.getItem("metronomeConfig");
  if (saved) {
    Object.assign(cfg, JSON.parse(saved));
    // Immediately sync points with loaded config
    points.value = [
      { bar: 0, bpm: cfg.startBpm },
      { bar: 8, bpm: cfg.maxBpm },
      { bar: 12, bpm: cfg.endBpm },
    ];
  }
});

// Sync: When config changes (via menu), update points
watch([() => cfg.startBpm, () => cfg.maxBpm, () => cfg.endBpm], ([s, m, e]) => {
  points.value[0].bpm = s;
  points.value[1].bpm = m;
  points.value[2].bpm = e;
});

// Sync: When points change (via dragging), update config
function updatePoints(p: [TempoPoint, TempoPoint, TempoPoint]) {
  points.value = p;
  cfg.startBpm = p[0].bpm;
  cfg.maxBpm = p[1].bpm;
  cfg.endBpm = p[2].bpm;
}

const engine = useMetronomeEngine();
const tempoMap = computed(() =>
  engine.buildTempoMap(points.value, cfg.barsPerCell)
);

function start() {
  engine.start(points.value, cfg.stopAtEnd, cfg.barsPerCell);
}

const isRunning = computed(() => engine.isRunning.value);
</script>

<template>
  <div
    class="w-full max-w-[1080px] mx-auto rounded-lg flex flex-col gap-0 bg-gray-800 relative p-0 h-full"
  >
    <Header v-model="cfg" :is-running="engine.isRunning" />

    <div class="flex flex-col gap-4">
      <MetronomeGrid
        :cols="16"
        :rows="37"
        :start-bpm="cfg.startBpm"
        :max-bpm="cfg.maxBpm"
        :end-bpm="cfg.endBpm"
        :bars-per-cell="cfg.barsPerCell"
        :tempo-map="tempoMap"
        :playhead-bar="engine.visualBar"
        @update:points="updatePoints"
      />
      <div class="flex gap-2 justify-center items-center px-3">
        <Button
          v-if="!isRunning"
          icon="solar:play-bold"
          size="big"
          shape="rounded"
          @click="start"
        />
        <Button
          v-if="isRunning"
          icon="solar:stop-bold"
          type="alert"
          shape="rounded"
          size="big"
          @click="engine.stop()"
        />
      </div>
      <span class="font-bold text-2xl px-3 text-white">
        {{ engine.currentBpm }} BPM
      </span>
    </div>
  </div>
</template>
