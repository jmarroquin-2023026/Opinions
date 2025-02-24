import { Router } from "express";
import { addU, getById, list, login, update, updatePassword } from "./user.controller.js";
import { isAdmin, isClient, validateJwt } from "../../middlewares/validate.jwt.js";
import { registerValidator, updateUserValidator } from "../../middlewares/validator.js";


const api=Router()

api.post('/register',registerValidator, addU)
api.post('/login',login)
api.get('/list',list)
api.get('/search/:id', getById)
api.put('/updateU',validateJwt,isClient, updateUserValidator, update)
api.put('/updatePassword',validateJwt,isClient,isAdmin,updatePassword)

export default api