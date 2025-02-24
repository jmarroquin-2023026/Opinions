import { Schema,model } from "mongoose";

const categorySchema=Schema(
    {
        name:{
            type:String,
            maxLength:[25,`Can't be overcome 25 characters`],
            unique:[true]
        },
        description:{
            type:String,
            maxLength:[150,`Can't be overcome 150 characters`]
        }
    }
)

categorySchema.methods.toJSON = function(){
    const { __v, ...category } = this.toObject() 
    return category
}

export default model('Category',categorySchema)