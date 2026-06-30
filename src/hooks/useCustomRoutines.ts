import { useCallback, useEffect, useState } from 'react';
import { CustomRoutine, CustomRoutineExerciseRef } from '@/types/customRoutine';

const STORAGE_KEY = 'custom_routines_v1';
const MAX_ROUTINES = 3;

const readRoutines = (): CustomRoutine[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomRoutine[]) : [];
  } catch {
    return [];
  }
};

const writeRoutines = (routines: CustomRoutine[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
};

export const useCustomRoutines = () => {
  const [routines, setRoutines] = useState<CustomRoutine[]>(() => readRoutines());

  useEffect(() => {
    setRoutines(readRoutines());
  }, []);

  const saveRoutine = useCallback((name: string, exercises: CustomRoutineExerciseRef[]) => {
    const current = readRoutines();
    if (current.length >= MAX_ROUTINES) {
      return { ok: false as const, reason: 'limit_reached' as const };
    }
    const next: CustomRoutine[] = [
      ...current,
      { id: `routine-${Date.now()}`, name, createdAt: Date.now(), exercises },
    ];
    writeRoutines(next);
    setRoutines(next);
    return { ok: true as const };
  }, []);

  const deleteRoutine = useCallback((id: string) => {
    const next = readRoutines().filter((r) => r.id !== id);
    writeRoutines(next);
    setRoutines(next);
  }, []);

  const getRoutine = useCallback((id: string) => {
    return readRoutines().find((r) => r.id === id);
  }, []);

  return { routines, saveRoutine, deleteRoutine, getRoutine, maxRoutines: MAX_ROUTINES };
};
