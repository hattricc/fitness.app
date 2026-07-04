import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { TimerConfig, TimerPhase, TimerStep } from '@/types/timer';
import { useTimerAudio } from '@/hooks/useTimerAudio';
import './TimerPage.css';

// ── Pure helpers ──────────────────────────────────────────────────────────────

function buildSequence(cfg: TimerConfig): TimerStep[] {
  const seq: TimerStep[] = [];
  seq.push({ type: 'prep', label: 'PREPARACIÓN', duration: cfg.prepTime, series: 0, exercise: 0 });
  for (let s = 1; s <= cfg.sets; s++) {
    for (let e = 1; e <= cfg.exercisesPerSet; e++) {
      seq.push({ type: 'work', label: `SERIE ${s} · EJERCICIO ${e}`, duration: cfg.workTime, series: s, exercise: e });
      if (e < cfg.exercisesPerSet && cfg.betweenTime > 0) {
        seq.push({ type: 'entre', label: 'ENTRE EJERCICIOS', duration: cfg.betweenTime, series: s, exercise: e });
      }
    }
    if (s < cfg.sets) {
      seq.push({ type: 'rest', label: 'DESCANSO', duration: cfg.restTime, series: s, exercise: 0 });
    }
  }
  return seq;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

// ── Mutable timer state ───────────────────────────────────────────────────────

interface MutableTimer {
  sequence: TimerStep[];
  stepIndex: number;
  secondsLeft: number;
  stepDuration: number;
  paused: boolean;
  elapsedSeconds: number;
  totalDuration: number;
  cfg: TimerConfig;
}

const DEFAULT_CFG: TimerConfig = {
  prepTime: 10,
  workTime: 30,
  betweenTime: 10,
  exercisesPerSet: 4,
  sets: 4,
  restTime: 120,
};

const NEXT_LABELS: Record<string, string> = {
  prep: 'Preparación',
  rest: 'Descanso',
  entre: 'Entre ejercicios',
};

const FIELDS = [
  { id: 'prepTime',        label: 'Tiempo de preparación',  unit: 'seg', min: 1,  max: 60  },
  { id: 'workTime',        label: 'Duración por ejercicio',  unit: 'seg', min: 5,  max: 300 },
  { id: 'betweenTime',     label: 'Tiempo entre ejercicios', unit: 'seg', min: 0,  max: 60  },
  { id: 'exercisesPerSet', label: 'Ejercicios por serie',    unit: '#',   min: 1,  max: 20  },
  { id: 'sets',            label: 'Número de series',        unit: '#',   min: 1,  max: 20  },
  { id: 'restTime',        label: 'Tiempo de descanso',      unit: 'seg', min: 5,  max: 600 },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimerPage() {
  const audio = useTimerAudio();

  const [formCfg, setFormCfg] = useState<TimerConfig>(DEFAULT_CFG);
  const [screen, setScreen] = useState<'config' | 'timer'>('config');
  const [isDone, setIsDone] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [, setTick] = useState(0);

  const ms = useRef<MutableTimer>({
    sequence: [],
    stepIndex: 0,
    secondsLeft: 0,
    stepDuration: 0,
    paused: false,
    elapsedSeconds: 0,
    totalDuration: 0,
    cfg: DEFAULT_CFG,
  });

  const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startStepRef = useRef<() => void>(() => {});
  const startTickRef = useRef<() => void>(() => {});

  startTickRef.current = () => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    setTick(t => t + 1);
    timerIdRef.current = setInterval(() => {
      const s = ms.current;
      if (s.paused) return;
      s.secondsLeft--;
      s.elapsedSeconds++;
      if (s.secondsLeft <= 0) {
        clearInterval(timerIdRef.current!);
        timerIdRef.current = null;
        s.stepIndex++;
        startStepRef.current();
        return;
      }
      setTick(t => t + 1);
    }, 1000);
  };

  startStepRef.current = () => {
    const s = ms.current;
    if (s.stepIndex >= s.sequence.length) {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      setIsDone(true);
      audio.doneBeep();
      return;
    }
    const step = s.sequence[s.stepIndex];
    s.stepDuration = step.duration;
    s.secondsLeft = step.duration;
    audio.cancelScheduled();
    audio.scheduleAllBeeps(step);
    startTickRef.current();
  };

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      audio.cancelScheduled();
    };
  }, []);

  // ── Derived display values ────────────────────────────────────────────────

  const s = ms.current;
  const currentStep = s.sequence[s.stepIndex];
  const nextStep    = s.sequence[s.stepIndex + 1];
  const phase: TimerPhase = isDone ? 'done' : (currentStep?.type ?? 'prep');
  const pct = s.stepDuration > 0 ? (s.secondsLeft / s.stepDuration) * 100 : 0;

  const seriesIndicator = currentStep
    ? currentStep.type === 'work' || currentStep.type === 'entre'
      ? `Serie ${currentStep.series} / ${s.cfg.sets}`
      : currentStep.type === 'rest'
      ? `Descanso · Serie ${currentStep.series} de ${s.cfg.sets}`
      : ''
    : '';

  const nextLabel = nextStep
    ? nextStep.type === 'work'
      ? nextStep.label
      : (NEXT_LABELS[nextStep.type] ?? nextStep.label)
    : null;

  const workSteps = s.sequence.filter(st => st.type === 'work');
  let workDoneCount = 0;
  s.sequence.slice(0, s.stepIndex).forEach(st => { if (st.type === 'work') workDoneCount++; });
  const dots = workSteps.map((_, i) => {
    if (i < workDoneCount) return 'done';
    if (i === workDoneCount && currentStep?.type === 'work') return 'active';
    return '';
  });

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleStart() {
    audio.unlockAudio();
    const cfg = { ...formCfg };
    const sequence = buildSequence(cfg);
    ms.current = {
      sequence,
      stepIndex: 0,
      secondsLeft: 0,
      stepDuration: 0,
      paused: false,
      elapsedSeconds: 0,
      totalDuration: sequence.reduce((acc, st) => acc + st.duration, 0),
      cfg,
    };
    setIsDone(false);
    setIsPaused(false);
    setScreen('timer');
    startStepRef.current();
  }

  function handlePause() {
    audio.unlockAudio();
    const nowPaused = !ms.current.paused;
    ms.current.paused = nowPaused;
    setIsPaused(nowPaused);
    if (nowPaused) audio.suspend(); else audio.resume();
  }

  function handleReset() {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    audio.cancelScheduled();
    audio.resume();
    ms.current.stepIndex = 0;
    ms.current.elapsedSeconds = 0;
    ms.current.paused = false;
    setIsPaused(false);
    setIsDone(false);
    startStepRef.current();
  }

  function handleBack() {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    audio.cancelScheduled();
    setScreen('config');
    setIsDone(false);
    setIsPaused(false);
  }

  function handleDoneBack() {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    setIsDone(false);
    setScreen('config');
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Config screen — normal MUI page, below the app header ── */}
      {screen === 'config' && (
        <Container maxWidth="sm" sx={{ py: 3, pb: 6 }}>
          <Typography variant="h5" fontWeight={900} gutterBottom color="text.secondary">
            Temporizador de Entrenamiento
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'rgba(0,0,0,0.5)' }}>
            Configura tu sesión y presiona comenzar
          </Typography>

          <Stack spacing={1.5} component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleStart(); }}>
            {FIELDS.map(({ id, label, unit, min, max }) => (
              <Box
                key={id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: '#1B1B1B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ flex: 1 }}>
                  {label}
                </Typography>
                <TextField
                  type="number"
                  value={formCfg[id]}
                  size="small"
                  inputProps={{ min, max }}
                  onChange={e => setFormCfg(prev => ({ ...prev, [id]: parseInt(e.target.value) || 0 }))}
                  sx={{
                    width: 80,
                    '& .MuiInputBase-input': { color: '#fff', textAlign: 'center' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  }}
                />
                <Typography variant="caption" sx={{ minWidth: 24, color: 'rgba(255,255,255,0.5)' }}>
                  {unit}
                </Typography>
              </Box>
            ))}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 1, py: 1.5, fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.08em' }}
            >
              COMENZAR
            </Button>
          </Stack>
        </Container>
      )}

      {/* ── Timer screen — fixed overlay above everything including the header ── */}
      {screen === 'timer' && (
        <div className={`timer-root phase-${phase}`}>
          <div className="timer-topbar">
            <button className="btn btn-back" onClick={handleBack}>← Configuración</button>
            <span className="series-indicator">{seriesIndicator}</span>
          </div>

          <div className="timer-body">
            <div className="timer-main">
              <div className="countdown">{isDone ? '✓' : s.secondsLeft}</div>
            </div>

            <div className="timer-info">
              <div className="phase-label">
                {isDone ? '¡COMPLETADO!' : (currentStep?.label ?? '')}
              </div>
              <div className="phase-bar">
                <div className="phase-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-dots">
                {dots.map((cls, i) => (
                  <div key={i} className={`dot${cls ? ` ${cls}` : ''}`} />
                ))}
              </div>
              <div className="next-phase">
                {nextLabel && <>A continuación: <span>{nextLabel}</span></>}
              </div>
              <div className="controls">
                <button
                  className={`btn ${isPaused ? 'btn-resume' : 'btn-pause'}`}
                  onClick={handlePause}
                >
                  {isPaused ? 'Reanudar' : 'Pausa'}
                </button>
                <button className="btn btn-reset" onClick={handleReset}>Reiniciar</button>
              </div>
            </div>
          </div>

          <div className="time-totals">
            <span>Transcurrido: <span className="time-value">{fmtTime(s.elapsedSeconds)}</span></span>
            <span>Faltante: <span className="time-value">{fmtTime(Math.max(0, s.totalDuration - s.elapsedSeconds))}</span></span>
          </div>

          {isDone && (
            <div className="done-overlay visible">
              <div className="done-title">¡Completado!</div>
              <div className="done-sub">Entrenamiento finalizado</div>
              <button
                className="btn btn-resume"
                style={{ flex: 'none', padding: '1rem 2rem', fontSize: '1rem' }}
                onClick={handleDoneBack}
              >
                Volver al inicio
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
