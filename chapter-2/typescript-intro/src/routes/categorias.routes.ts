import { Router } from "express"
import { CategoriesRepository } from "../repositories/CategoriesRepository"

const categoriesRoutes = Router()
const CategoriesRepositor = new CategoriesRepository()


categoriesRoutes.post("/", (request, response) => {
    const { name, description } = request.body

    CategoriesRepositor.create({name, description})
   // categories.push(category)
    return response.status(201).send()
})

categoriesRoutes.get("/", (req, res) => {
    const all = CategoriesRepositor.list()
    return res.json(all)
})

export { categoriesRoutes }