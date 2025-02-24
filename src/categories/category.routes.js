import { Router } from "express";
import { addCategory, deleteCategory, findCategory, listCategory, updateCategory } from "./category.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";
import { categoryValidator, updateCategoryValidator } from "../../middlewares/validator.js";

const api=Router()

api.post('/addC',validateJwt,isAdmin,categoryValidator,addCategory)
api.get('/listC',listCategory)
api.get('/findC/:id',findCategory)
api.put('/updateC/:id', validateJwt, isAdmin, updateCategoryValidator, updateCategory);

api.delete('/deleteC/:id',validateJwt,isAdmin,deleteCategory)

export default api