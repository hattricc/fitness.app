import { useRef } from 'react';
import { TimerStep } from '@/types/timer';

export function useTimerAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const scheduledNodesRef = useRef<OscillatorNode[]>([]);

  function getCtx(): AudioContext {
    if (!audioCtxRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  function unlockAudio() {
    try {
      const ctx = getCtx();
      ctx.resume();
      const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch (_) {}
  }

  function scheduleBeepAt(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    when: number
  ) {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.connect(vol);
      vol.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      vol.gain.setValueAtTime(gain, when);
      vol.gain.exponentialRampToValueAtTime(0.001, when + dur);
      osc.start(when);
      osc.stop(when + dur);
      scheduledNodesRef.current.push(osc);
      osc.onended = () => {
        const i = scheduledNodesRef.current.indexOf(osc);
        if (i >= 0) scheduledNodesRef.current.splice(i, 1);
      };
    } catch (_) {}
  }

  function cancelScheduled() {
    scheduledNodesRef.current.forEach(osc => { try { osc.stop(0); } catch (_) {} });
    scheduledNodesRef.current = [];
  }

  function scheduleAllBeeps(step: TimerStep) {
    const ctx = getCtx();
    ctx.resume().then(() => {
      const now = ctx.currentTime;
      scheduleBeepAt(1200, 0.25, 'square', 0.35, now);
      scheduleBeepAt(1500, 0.2,  'square', 0.3,  now + 0.2);
      if (step.type === 'entre') {
        for (let i = 1; i < step.duration; i++) {
          scheduleBeepAt(440, 0.06, 'sine', 0.4, now + i);
        }
      }
      const cStart = Math.min(5, step.duration - 1);
      for (let s = cStart; s >= 1; s--) {
        scheduleBeepAt(660, 0.1, 'sine', 0.5, now + (step.duration - s));
      }
    });
  }

  function doneBeep() {
    const ctx = getCtx();
    ctx.resume().then(() => {
      const now = ctx.currentTime;
      scheduleBeepAt(880,  0.2,  'square', 0.4, now);
      scheduleBeepAt(1100, 0.2,  'square', 0.4, now + 0.2);
      scheduleBeepAt(1320, 0.35, 'square', 0.4, now + 0.4);
    });
  }

  function suspend() { audioCtxRef.current?.suspend(); }
  function resume()  { audioCtxRef.current?.resume();  }

  return { unlockAudio, cancelScheduled, scheduleAllBeeps, doneBeep, suspend, resume };
}
