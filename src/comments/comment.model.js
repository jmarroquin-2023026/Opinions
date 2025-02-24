import mongoose, { Schema,model } from "mongoose";

const commentsSchema=Schema(
    {
        comment:{
            type:String,
            maxLength:[280,`Can't overcome 280 characters`]
        },
        author:{
            type:Schema.Types.ObjectId,
            ref:'User'

        },
        post:{
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    }
)

commentsSchema.methods.toJSON = function(){
    const {__v,...post}=this.toObject()
    return post
}

export default model('Comment', commentsSchema)