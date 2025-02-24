import { Router } from "express";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { addComment, deleteComment, updateComment } from "./comment.controller.js";
import {  updateCommentValidator } from "../../middlewares/validator.js";

const api=Router()

api.post('/comment',validateJwt,addComment)
api.delete('/deleteComment/:id',validateJwt,deleteComment)
api.put('/updateComment/:id',validateJwt,updateCommentValidator,updateComment)
export default api