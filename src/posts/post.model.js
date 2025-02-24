import { Schema,model } from "mongoose";

const postSchema=Schema(
    {
        title:{
            type:String,
            maxLength:[50, `Can't be overcome 50 characters`]
        },
        text:{
            type:String
        },
        category:[{
            type:Schema.Types.ObjectId,
            ref:'Category',
            required:true
        }],
        author:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        comment: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            required: false
        }]
    }
)

postSchema.methods.toJSON = function(){
    const {__v,...post}=this.toObject()
    return post
}

export default model('Post',postSchema)