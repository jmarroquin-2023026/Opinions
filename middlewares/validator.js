import { body } from "express-validator";
import { existCategory, existEmail, existUsername, findCategory, notRequiredField } from "../utils/db.validators.js";
import { validateErrors, validateErrorsWithoutFile } from "./validate.errors.js";


export const registerValidator=[
    body('name','Name cannot be empty').notEmpty(),
    body('surname','Surname cannot be empty').notEmpty(),
    body('username','Username cannot be empty').notEmpty().toLowerCase().custom(existUsername),
    body('email','Email cannot be empty').notEmpty().isEmail().custom(existEmail),
    body('password','Password cannot be empty').notEmpty().isStrongPassword().withMessage('Password must be strong').isLength({min:8}),
    validateErrors
]

export const updateUserValidator=[
    body('username').optional().notEmpty().toLowerCase()
        .custom((username,{req})=>existUsername(username,req.user)),
    body('email').optional().notEmpty().toLowerCase()
        .custom((email,{req})=>existEmail(email,req.user)),
    body('password').optional().notEmpty()
        .custom(notRequiredField),
    validateErrorsWithoutFile
]


export const categoryValidator=[
    body('name','Name cannot be empty').notEmpty().toLowerCase().custom(existCategory),
    body('description','Description cannot be empty').notEmpty(),
    validateErrors
]
export const updateCategoryValidator = [
    body('name').optional().notEmpty().custom(notRequiredField),
    validateErrorsWithoutFile
]

export const updateCommentValidator=[
    body('author').optional().notEmpty().custom(notRequiredField),
    body('post').optional().notEmpty().custom(notRequiredField),
    validateErrorsWithoutFile
]