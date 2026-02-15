import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import type {
  MetronomeConfig,
  MetronomePreset,
  TempoPoint,
} from "../assets/types";

export const useMetronomeStore = defineStore("metronome", () => {
  // 1. State
  const config = reactive<MetronomeConfig>({
    startBpm: 100,
    maxBpm: 140,
    endBpm: 115,
    stopAtEnd: true,
    barsPerCell: 1,
    tempoStep: "cell",
    points: [
      { bar: 0, bpm: 100 },
      { bar: 8, bpm: 140 },
      { bar: 12, bpm: 115 },
    ],
  });

  const isRunning = ref(false);

  // 2. Load initial data
  const saved = localStorage.getItem("metronomeConfig");
  if (saved) {
    Object.assign(config, JSON.parse(saved));
  }

  // 3. Actions
  function bump(key: keyof MetronomeConfig, delta: number) {
    if (typeof config[key] !== "number") return;
    const next = Math.min(225, Math.max(40, (config[key] as number) + delta));

    if (key === "startBpm") {
      config.startBpm = Math.min(next, config.maxBpm, config.endBpm);
    } else if (key === "maxBpm") {
      config.maxBpm = Math.max(next, config.startBpm, config.endBpm);
    } else if (key === "endBpm") {
      config.endBpm = Math.max(config.startBpm, Math.min(next, config.maxBpm));
    }
  }

  function updatePoints(p: [TempoPoint, TempoPoint, TempoPoint]) {
    config.points = p;
    config.startBpm = p[0].bpm;
    config.maxBpm = p[1].bpm;
    config.endBpm = p[2].bpm;
  }

  function loadPreset(p: MetronomePreset | MetronomeConfig) {
    if (p.points) config.points = JSON.parse(JSON.stringify(p.points));
    config.startBpm = p.startBpm;
    config.maxBpm = p.maxBpm;
    config.endBpm = p.endBpm;
    config.stopAtEnd = p.stopAtEnd;
    config.barsPerCell = p.barsPerCell;
    config.tempoStep = p.tempoStep || "cell";
  }

  // Sync BPM changes to points array automatically
  watch(
    [() => config.startBpm, () => config.maxBpm, () => config.endBpm],
    ([s, m, e]) => {
      config.points[0].bpm = s;
      config.points[1].bpm = m;
      config.points[2].bpm = e;
    }
  );

  return {
    config,
    isRunning,
    bump,
    updatePoints,
    loadPreset,
  };
});
