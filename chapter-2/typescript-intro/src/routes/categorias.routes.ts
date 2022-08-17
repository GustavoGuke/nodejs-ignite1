import { Router } from "express"
import { CategoriesRepository } from "../repositories/CategoriesRepository"
import { CreateCategoryservices } from "../services/CreateCategoryServices"

const categoriesRoutes = Router()
const categoriesRepository = new CategoriesRepository()


categoriesRoutes.post("/", (request, response) => {
    const { name, description } = request.body

    const createCategoryservices = new CreateCategoryservices(categoriesRepository)

    createCategoryservices.execute({name, description})
    return response.status(201).send()
})

categoriesRoutes.get("/", (req, res) => {
    const all = categoriesRepository.list()
    return res.json(all)
})

export { categoriesRoutes }