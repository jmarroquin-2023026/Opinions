import { Schema,model } from "mongoose";

const userSchema=Schema(
    {
        name:{
            type:String,
            unique:true,
            maxLength:[25,`Can't be overcome 25 characters`]
        },
        surname:{
            type:String,
            unique:true,
            maxLength:[25, `Can't be overcome 25 characters`]
        },
        username:{
            type:String,
            unique:true,
            maxLength:[15, `Can't be overcome 15 characters`]
        },
        email:{
            type:String,
            unique:true,
            required:[true, `email is required`]
        },
        password:{
            type:String,
            maxLength:[100, `Can't be overcome 100 characters`],
            minLength:[8,`Password must be 8 characteres`],
            required:true
        },
        role:{
                type:String,
                enum:['ADMIN','CLIENT'],
                uppercase:true,
        }
    }
)

userSchema.methods.toJSON = function(){
    const { __v, password, ...user } = this.toObject() //Sirve para convertir un documento de MongoDB a Objeto de JS
    return user
}

export default model('User',userSchema)