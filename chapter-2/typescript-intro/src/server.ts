import express from "express";
import {categoriesRoutes} from "./routes/categorias.routes";

const app = express();
app.use(express.json())


app.use("/categories",categoriesRoutes)


app.listen(4000, ()=> {;
    console.log("Server ok na porta 4000")
})
