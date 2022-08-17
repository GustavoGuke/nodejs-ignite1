import { Category } from "../model/category";
import { ICategoryRepository, ICreateCategory } from "./ICategoryRepository";

class PostgreCategoryRepository implements ICategoryRepository {
    findByName(name: string): Category {
        throw new Error("Method not implemented.");
    }
    list(): Category[] {
        throw new Error("Method not implemented.");
    }
    create({name, description}:ICreateCategory): void {
        throw new Error("Method not implemented.");
    }

}

export {PostgreCategoryRepository}