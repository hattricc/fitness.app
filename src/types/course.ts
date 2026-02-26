export interface Exercise {
    id: string;
    visible?: boolean;
    category: string;
    subcategory: string;
    duration: string | undefined;
    rest: string | undefined;
    name: string;
    url: string;
    sets: string | undefined;
    repetitions: string | undefined;
    locked: boolean;
}

export interface Module {
    id: string;
    visible?: boolean;
    category: string;
    subcategory: string;
    duration: string;
    name: string;
    url: string;
    exercises: Exercise[];
    note: React.ReactNode;
}

export interface Course {
    category: string;
    subcategory: string;
    id: string;
    name: string;
    title: string;
    showTitle: boolean;
    url: string;
    description: string;
    showDescription: boolean;
    infoDescription: string;
    imageUrl: string;
    duration: string;
    showInfo: boolean;
    visible?: boolean;
    locked?: boolean;
    modules: Module[];
}