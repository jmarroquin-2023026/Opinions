import { Router } from "express";
import { addU, find, list } from "./user.controller.js";

const api=Router()

api.post('/register', addU)
api.get('/list',list)
api.get('/search/:id', find)

export default api