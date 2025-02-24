import { checkPassword, encrypt } from '../../utils/encryp.js'
import { generateJwt } from '../../utils/jwt.js';
import User from './user.model.js'
import argon from 'argon2'

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

export const login=async(req,res)=>{
    try{
        let {userLogin,password}=req.body
        let user=await User.findOne({
            $or:[
                {email:userLogin},
                {username:userLogin}
            ]
        })
        if(user && await checkPassword(user.password,password)){
            let loggedUser={
                uid:user._id,
                username:user.username,
                name:user.name,
                role:user.role

            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message:`Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(400).send({message:'Invalid credentials'})
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'General error with login function', e})
    }
}

export const list=async(req,res)=>{
    try{
        const {limit = 20,skip=0}= req  .query
        //Consultar
        const users=await User.find()
            .skip(skip)
            .limit(limit)
        if(users.length===0)return res.status(404).send(
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

export const getById=async(req,res)=>{
    try{
        const { id }=req.params
        const user=await User.findById(id)
        if(!user){
            return res.status(404).send(
                {
                    success:false,
                    message:'user not found',
                }
            )
        }
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

export const update=async(req,res)=>{
    try{
        const id=req.user.uid
        const data=req.body
        const {role} = req.body
        const validRoles = ["CLIENT", "ADMIN"];
        if (!validRoles.includes(role)) {
            return res.status(400).send({
                success: false,
                message: "Invalid role. Allowed roles: CLIENT, ADMIN"
            });
        }
        const user = await User.findById(id)
        if(user.role==='ADMIN'){
            return res.status(400).send({
                success:false,
                message:'You cannot change role'
            })
        }
        const updateUser = await User.findByIdAndUpdate(id,data,{new:true})
        return res.status(200).send(
            {
                success:true,
                message:'User updated successfully',
                user:updateUser
            }
        )
    }catch(e){
        return res.status(500).send(
            {
                message:'Internal server Error',
                e
            }
        )
    }
}

export const updatePassword=async(req,res)=>{
    try{
        const id=req.user.uid
        const{oldPassword,newPassword}=req.body
        const user = await User.findById(id)
    
        const compare=await argon.verify(user.password,oldPassword)
        if(!compare){
            return res.status(400).send(
                {
                    success:false,
                    message:'Incorrect password'
                }
            )
        }
        user.password=await encrypt(newPassword)
        user.save()
        return res.status(200).send(
            {
                success:true,
                message:'Password updated successfully'
            }
        )
    }catch(e){
        return res.status(500).send(
            {
                message:'Internal server Error',
                e
                
            }
        )
    }
}