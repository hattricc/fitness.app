export interface Exercise {
    id: string;
    category: string;
    subcategory: string;
    duration: string | undefined;
    name: string;
    url: string;
    sets: string | undefined;
    repetitions: string | undefined;
}

export interface Module {
    id: string;
    category: string;
    subcategory: string;
    duration: string;
    name: string;
    url: string;
    exercises: Exercise[];
}

export interface Course {
    category: string;
    subcategory: string;
    id: string;
    name: string;
    url: string;
    description: string;
    imageUrl: string;
    duration: string;
    modules: Module[];
}