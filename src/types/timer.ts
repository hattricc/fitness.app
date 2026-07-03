export type StepType = 'prep' | 'work' | 'entre' | 'rest';
export type TimerPhase = StepType | 'done';

export interface TimerConfig {
  prepTime: number;
  workTime: number;
  betweenTime: number;
  exercisesPerSet: number;
  sets: number;
  restTime: number;
}

export interface TimerStep {
  type: StepType;
  label: string;
  duration: number;
  series: number;
  exercise: number;
}
