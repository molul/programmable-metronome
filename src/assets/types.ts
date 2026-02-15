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
  // ADD THIS LINE HERE:
  points: [TempoPoint, TempoPoint, TempoPoint];
}

export interface MetronomePreset extends MetronomeConfig {
  name: string;
  // points, stopAtEnd, and barsPerCell are already inherited!
}
