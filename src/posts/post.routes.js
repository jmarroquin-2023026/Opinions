import { Router } from "express";
import { addPost, deletePost, Posts, updatePost } from "./post.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";


const api=Router()

api.post('/post',validateJwt,addPost)
api.get('/viewPost',Posts)
api.put('/update/:id',validateJwt,updatePost)
api.delete('/deletePost/:id',validateJwt,deletePost)

export default api