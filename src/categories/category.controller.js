import Category from './category.model.js'
import Post from '../posts/post.model.js';

export const defaultCategory = async () => {
    try {
        const categories = await Category.countDocuments();
        if (categories === 0) {
            const defaultCategories = [
                { name: 'General', description: 'General category' },
                { name: 'Games', description: 'Category dedicated to games' },
                { name: 'Travels', description: 'Share your best moments of your travels' },
                { name: 'Food', description: 'Share food with the people posting in this category' }
            ];
            await Category.insertMany(defaultCategories);
            console.log('Categories added successfully');
        }
            console.log('Default categories already exists')
    } catch (e) {
        console.error('Error adding default categories:', e);
    }
};

export const addCategory = async(req,res)=>{
    try{
        const data=req.body
        const category=new Category(data)
        await category.save()
        return res.status(200).send(
            {
                success:true,
                message:'category saved successfully',
                category
            }
        )
    }catch(e){
        return res.status(500).send({message:'Internal server Error',e})
    }
}

export const listCategory =async(req,res)=>{
   try{
     const {limit = 20,skip=0}= req  .query
            //Consultar
            const categories=await Category.find()
                .skip(skip)
                .limit(limit)
    if(categories.length===0){
        return res.status(404).send(
            {
                success:false,
                message:'Categories not found'
            }
        )
    }
    return res.status(200).send(
        {
            success:true,
            message:'Categories found',
            categories
        }
    )
   }catch(e){
        return res.status(500).send({message:'Internal server Error',e})
   }
}

export const findCategory = async(req,res)=>{
    try{
        const {id}=req.params
        const category=await Category.findById(id)
        if(!category){
            return res.status(404).send(
                {
                    success:false,
                    message:'Category not found'
                }
            )
        }
        return res.status(200).send(
            {
                success:true,
                message:'Category found',
                category
            }
        )
    }catch(e){
        return res.status(500).send({message:'Internal server Error',e})
    }
}

export const updateCategory = async(req,res)=>{
    try{
        const {id}=req.params
        const data=req.body
        
        const updatedCategory = await Category.findByIdAndUpdate(id,data,{new:true})
        if(!updatedCategory){
            return res.status(404).send(
                {
                    success:false,
                    message:'Category not found'
                }
            )
        }
        
        return res.status(200).send(
            {
                success:true,
                message:'Category updated successfully',
                updatedCategory
            }
        )
    }catch(e){
        return res.status(500).send({message:'Internal server Error',e})
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        let generalCategory = await Category.findOne({ name: 'General' })
        if (!generalCategory) {
            generalCategory = new Category({ name: 'General' })
            await generalCategory.save()
        }
        if (id == generalCategory._id.toString()) {
            return res.status(400).send({
                success: false,
                message: 'The General category cannot be deleted.',
            })
        }
        const deletedCategory = await Category.findById(id);
        if (!deletedCategory) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            })
        }
        await Post.updateMany(
            {category: id },
            {$set: {category: generalCategory._id }} 
        )
        await Category.findByIdAndDelete(id);
        return res.status(200).send({
            success: true,
            message: 'Category deleted successfully. Posts were moved to the General category.',
        })
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'Internal server error', e })
    }
}
