import { isValidObjectId } from 'mongoose'
import User from '../src/users/user.model.js'
import Category from '../src/categories/category.model.js'

export const existUsername=async(username,user)=>{
    const alreadyUsername=await User.findOne({username})
    if(alreadyUsername && alreadyUsername._id != user.uid){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}


export const existEmail=async(email,user)=>{
    const alreadyEmail=await User.findOne({email})
    if(alreadyEmail && alreadyEmail._id != user.uid){
        console.error(`Username ${email} is already taken`)
        throw new Error(`Username ${email} is already taken`)
    }
}

export const existCategory = async(name,category)=>{
    const alreadycategory = await Category.findOne({name})
    if(alreadycategory && alreadycategory._id != category.uid){
        console.error(`Category ${name}  already exist`)
        throw new Error(`Category ${name} already taken`)
    }
}

export const notRequiredField=(field)=>{
    if(field){
        throw new Error(`${field} is not required`)
    }
}

export const objectValid=(objectId)=>{
    if(!isValidObjectId(objectId)){
        throw new Error(`Id is not a valid ObjectId`)
    }
}

export const findUser=async(id)=>{
    try{
        const userExist=await User.findById(id)
        if(!userExist)return false
        return userExist
    }catch(e){
        console.error(e)
        return e
    }
}

export const findCategory = async (id) => {
    try {
        const categoryExist = await Category.findById(id)
        if (!categoryExist) return false
        return categoryExist
    } catch (e) {
        console.error(e)
        return e
    }
}
