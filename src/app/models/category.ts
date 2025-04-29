import { Subcategory } from "./subcategory";

export class Category {
    id: number = 0;
    name: string = '';
    subcategory?: Subcategory[];
}