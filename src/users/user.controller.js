
import { encrypt } from '../../utils/encryp.js'
import User from './user.model.js'

export const DefaultUser = async () => {
    try {
        const usersList = await User.findOne({ role: 'ADMIN' });
        if (!usersList) {
            const admindefault = new User({
                name: 'Josue',
                surname: 'Marroquin',
                username: 'jmarroquin',
                email: 'jmarroquin-2023026@kinal.edu.gt',
                password: await encrypt(`sfas.ad$s1`),
                role: 'ADMIN'
            });

            await admindefault.save();
            console.log('Default admin created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (e) {
        console.error('Error adding default admin:', e);
    }
};

export const addU = async(req,res)=>{
    try{
        const data=req.body
        const user=new User(data)
        user.password=await encrypt(user.password)
        user.role='CLIENT'
        await user.save()
        return res.status(200).send(
            {
                success:true,
                message: `Registered successfully, can be logged with username: ${user.username}`,
                user
            }
        )
    }catch(e){
        console.error('Error adding a user',e)
    }
}

export const list=async(req,res)=>{
    try{
        const users= new User.find()
        if(users===0)return res.status(404).send(
            {
                success:false,
                message:'Users not found'
            }
        )
        return res.status(200).send(
            {
                success:true,
                message:'Users found',
                users
            }
        )
    }catch(e){
        return res.status(500).send({message:'Internal server error',e})
    }
}

export const find=async(req,res)=>{
    try{
        const {id}=req.params
        const user=new User.findBydId(id)
        if(!user)return res.status(404).send(
            {
                success:false,
                message:'user not found',
            }
        )
        return res.status(200).send(
            {
                success:true,
                message:'User found',
                user
            }
        )
    }catch(e){
        return res.status(500).send({message:'Internal server error',e})
    }
}