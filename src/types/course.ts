
export interface Module {
    id: string;
    category: string;
    subcategory: string;
    duration: string;
    name: string;
    url: string;
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