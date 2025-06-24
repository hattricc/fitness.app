import { WorkoutRoutine } from '../types/exercise';

const mockWorkouts: Record<string, WorkoutRoutine> = {
  '1': {
    id: '1',
    name: 'Tren Inferior',
    difficulty: 'principiante',
    duration: 15,
    calories: 120,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
    description: 'Tren Inferior',
    category: 'Stretching',
    rounds: [
      {
        id: 'r1',
        exercises: [
          {
            id: 'e1',
            name: 'Barra de Máquina Smith',
            duration: 30,
            calories: 10,
            imageUrl: 'https://eresfitness.com/wp-content/uploads/2020/12/Press-de-hombros-sentado-en-maquina-Smith.webp',
            description: 'Barra de Máquina Smith',
            difficulty: 'principiante',
            category: 'tren-inferior',
            sets: [
              { 
                id: 's1', 
                name: 'Set 1', 
                description: 'Barra de Máquina Smith', 
                duration: 30, 
                rest: 10, 
                videoUrl: '' 
              }
            ]
          },
          {
            id: 'e2',
            name: 'Prensa en máquina',
            duration: 30,
            calories: 15,
            imageUrl: 'https://eresfitness.com/wp-content/uploads/2020/12/Press-de-pierna-en-maquina.webp',
            description: 'Prensa en máquina',
            difficulty: 'principiante',
            category: 'tren-inferior',
            sets: [
              { 
                id: 's2', 
                name: 'Set 1', 
                description: 'Prensa en máquina', 
                duration: 30, 
                rest: 10, 
                videoUrl: '' 
              }
            ]
          }
        ]
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Rutina de fuerza',
    difficulty: 'intermedio',
    duration: 45,
    calories: 300,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
    description: 'Rutina de fuerza para todos los niveles de fitness',
    category: 'Full Body',
    rounds: [
      {
        id: 'r1',
        exercises: [
          {
            id: 'e3',
            name: 'Push-ups',
            duration: 45,
            calories: 50,
            imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
            description: 'Basic push-up exercise',
            difficulty: 'intermedio',
            category: 'Strength',
            sets: [
              { 
                id: 's3',
                name: 'Set 1',
                duration: 45,
                rest: 30,
                description: 'Push-ups set 1',
                videoUrl: ''
              },
              { 
                id: 's4',
                name: 'Set 2',
                duration: 45,
                rest: 30,
                description: 'Push-ups set 2',
                videoUrl: ''
              }
            ]
          },
          {
            id: 'e4',
            name: 'Squats',
            duration: 45,
            calories: 60,
            imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
            description: 'Bodyweight squats',
            difficulty: 'intermedio',
            category: 'Strength',
            sets: [
              { 
                id: 's5',
                name: 'Set 1',
                duration: 45,
                rest: 30,
                description: 'Squats set 1',
                videoUrl: ''
              },
              { 
                id: 's6',
                name: 'Set 2',
                duration: 45,
                rest: 30,
                description: 'Squats set 2',
                videoUrl: ''
              }
            ]
          }
        ]
      }
    ]
  }
};

export const getWorkoutById = (id: string): WorkoutRoutine | undefined => {
  return mockWorkouts[id];
};

export const mockWorkout = mockWorkouts['1']; // Default export for backward compatibility
