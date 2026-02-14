export interface TempoPoint {
  bar: number;
  bpm: number;
}

export interface MetronomeConfig {
  startBpm: number;
  maxBpm: number;
  endBpm: number;
  stopAtEnd: boolean;
  barsPerCell: number;
}

export interface MetronomePreset extends MetronomeConfig {
  name: string;
}
