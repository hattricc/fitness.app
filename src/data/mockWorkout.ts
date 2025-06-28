import { WorkoutRoutine } from '../types/exercise';

const mockWorkouts: Record<string, WorkoutRoutine> = {
  '1': {
    id: '1',
    name: 'Tren Inferior',
    tag: 'Día 1',
    difficulty: 'gimnasio',
    duration: 15,
    calories: 120,
    imageUrl: 'https://i.ytimg.com/vi/ECKQX0583z4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAgwY1fWquWuK3TCq2EdmlFNU4luA',
    description: 'Tren Inferior',
    category: 'tren-inferior',
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
            difficulty: 'gimnasio',
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
            difficulty: 'gimnasio',
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
    tag: 'Día 2',
    difficulty: 'exteriores',
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
            difficulty: 'exteriores',
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
            difficulty: 'exteriores',
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
  },
  '3': {
    id: '3',
    name: 'Rutina de Peso Libre',
    tag: 'Día 3',
    difficulty: 'gimnasio',
    duration: 40,
    calories: 280,
    imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop',
    description: 'Rutina completa con mancuernas y barras',
    category: 'gimnasio',
    rounds: [
      {
        id: 'r1',
        exercises: [
          {
            id: 'e5',
            name: 'Press de Banca',
            duration: 45,
            calories: 80,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Press de banca con barra',
            difficulty: 'gimnasio',
            category: 'pecho',
            sets: [
              { id: 's5', name: 'Set 1', description: '12 repeticiones', duration: 45, rest: 60, videoUrl: '' },
              { id: 's6', name: 'Set 2', description: '10 repeticiones', duration: 45, rest: 60, videoUrl: '' }
            ]
          },
          {
            id: 'e6',
            name: 'Peso Muerto',
            duration: 50,
            calories: 90,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Peso muerto convencional',
            difficulty: 'gimnasio',
            category: 'piernas',
            sets: [
              { id: 's7', name: 'Set 1', description: '10 repeticiones', duration: 50, rest: 60, videoUrl: '' },
              { id: 's8', name: 'Set 2', description: '8 repeticiones', duration: 50, rest: 60, videoUrl: '' }
            ]
          }
        ]
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Máquinas Superiores',
    tag: 'Día 1',
    difficulty: 'gimnasio',
    duration: 35,
    calories: 220,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
    description: 'Enfoque en la parte superior del cuerpo usando máquinas',
    category: 'gimnasio',
    rounds: [
      {
        id: 'r2',
        exercises: [
          {
            id: 'e7',
            name: 'Remo en Máquina',
            duration: 40,
            calories: 70,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Ejercicio de espalda en máquina',
            difficulty: 'gimnasio',
            category: 'espalda',
            sets: [
              { id: 's9', name: 'Set 1', description: '12 repeticiones', duration: 40, rest: 45, videoUrl: '' },
              { id: 's10', name: 'Set 2', description: '10 repeticiones', duration: 40, rest: 45, videoUrl: '' }
            ]
          },
          {
            id: 'e8',
            name: 'Press de Hombros en Máquina',
            duration: 35,
            calories: 60,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Press de hombros en máquina sentado',
            difficulty: 'gimnasio',
            category: 'hombros',
            sets: [
              { id: 's11', name: 'Set 1', description: '12 repeticiones', duration: 35, rest: 45, videoUrl: '' }
            ]
          }
        ]
      }
    ]
  },
  '5': {
    id: '5',
    name: 'Entrenamiento en Parque',
    tag: 'Día 2',
    difficulty: 'exteriores',
    duration: 30,
    calories: 250,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-cf63a5601a96?w=800&auto=format&fit=crop',
    description: 'Rutina completa usando solo el peso corporal en parque',
    category: 'exteriores',
    rounds: [
      {
        id: 'r3',
        exercises: [
          {
            id: 'e9',
            name: 'Dominadas',
            duration: 45,
            calories: 70,
            imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop',
            description: 'Dominadas en barra de parque',
            difficulty: 'exteriores',
            category: 'superior',
            sets: [
              { id: 's12', name: 'Set 1', description: 'Máximas repeticiones', duration: 45, rest: 60, videoUrl: '' },
              { id: 's13', name: 'Set 2', description: 'Máximas repeticiones', duration: 45, rest: 60, videoUrl: '' }
            ]
          },
          {
            id: 'e10',
            name: 'Fondos en Banco',
            duration: 35,
            calories: 60,
            imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop',
            description: 'Fondos en banco del parque',
            difficulty: 'exteriores',
            category: 'superior',
            sets: [
              { id: 's14', name: 'Set 1', description: '15 repeticiones', duration: 35, rest: 45, videoUrl: '' }
            ]
          }
        ]
      }
    ]
  },
  '6': {
    id: '6',
    name: 'Cardio al Aire Libre',
    tag: 'Día 3',
    difficulty: 'exteriores',
    duration: 45,
    calories: 400,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
    description: 'Entrenamiento de cardio intenso en exteriores',
    category: 'exteriores',
    rounds: [
      {
        id: 'r4',
        exercises: [
          {
            id: 'e11',
            name: 'Sprints',
            duration: 60,
            calories: 120,
            imageUrl: 'https://images.unsplash.com/photo-1571019614242-cf63a5601a96?w=800&auto=format&fit=crop',
            description: 'Sprints cortos de 30 segundos',
            difficulty: 'exteriores',
            category: 'cardio',
            sets: [
              { id: 's15', name: 'Set 1', description: '6 sprints de 30s', duration: 240, rest: 30, videoUrl: '' }
            ]
          },
          {
            id: 'e12',
            name: 'Escaleras',
            duration: 30,
            calories: 80,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Subida de escaleras',
            difficulty: 'exteriores',
            category: 'cardio',
            sets: [
              { id: 's16', name: 'Set 1', description: '10 minutos continuos', duration: 600, rest: 60, videoUrl: '' }
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

export const getAllWorkouts = (): WorkoutRoutine[] => {
  return Object.values(mockWorkouts);
};

export const mockWorkout = mockWorkouts['1']; // Default export for backward compatibility

export default mockWorkouts;
