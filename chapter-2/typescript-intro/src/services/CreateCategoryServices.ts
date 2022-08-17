import { CategoriesRepository } from "../repositories/CategoriesRepository";
import { ICategoryRepository } from "../repositories/ICategoryRepository";

interface IRequest {
    name: string;
    description: string
}


class CreateCategoryservices {

    constructor(private categoriesRepository: ICategoryRepository){}

    execute({name, description}: IRequest):void {
        const categoryExists = this.categoriesRepository.findByName(name)

        if (categoryExists) {
            throw new Error ("Categpry already exists")
        }

        this.categoriesRepository.create({ name, description })
    }
}

export { CreateCategoryservices }