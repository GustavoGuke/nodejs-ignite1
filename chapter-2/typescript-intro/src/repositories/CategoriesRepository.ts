import { Category } from "../model/category"


interface ICreateCategory {
    name: string;
    description: string;
}

class CategoriesRepository {
    private categories: Category[]

    constructor() {
        this.categories = []
    }

    create({ name, description }: ICreateCategory) {

        const category = new Category()
        Object.assign(category, {
            name,
            description,
            created_at: new Date()
        })
        this.categories.push(category)
    }

    list(): Category[] {
        return this.categories;
    }
}

export { CategoriesRepository }