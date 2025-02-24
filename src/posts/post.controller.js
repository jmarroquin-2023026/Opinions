import Post from './post.model.js'
import Comment from '../comments/comment.model.js'
import User from '../users/user.model.js'
import Category from '../categories/category.model.js'
import { objectValid } from '../../utils/db.validators.js';

export const addPost = async (req, res) => {
    try {
        let { category, ...data } = req.body;
        if (!category) {
            return res.status(400).send({
                success: false,
                message: "Category is required",
            })
        }
        if (!Array.isArray(category)) {
            category = [category]; 
        }
        for (const categoryId of category) {
            objectValid(categoryId); 
        }
        const existingCategories = await Category.find({ _id: { $in: category } });
        if (existingCategories.length !== category.length) {
            return res.status(404).send({
                success: false,
                message: "One or more categories not found",
            })
        }

        const author = req.user.uid;
        data.author = author;
        data.category = category;

        let publication = new Post(data);
        await publication.save();

        return res.status(200).send({
            success: true,
            message: "Post saved successfully",
            publication,
        })
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: "General server error", e });
    }
}


export const Posts = async (req, res) => {
    try {
        const posts = await Post.find()
    .populate('category', 'name -_id')
    .populate('author', 'name surname -_id')
    .populate({
        path: 'comment',
        select: 'comment author -_id', 
        populate: {
            path: 'author', 
            select: 'name surname -_id'
        }
    })
        if (!posts) {
            return res.status(404).send({
                success: false,
                message: 'Posts not found'
            })
        }
        console.log(posts)
        return res.status(200).send({
            success: true,
            message: 'Posts found',
            posts
        })
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'General server error', e })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const authorId = req.user.uid
        if(data.category){
            if(Array.isArray(data.category)){
                for(let categoryId of data.category){
                    objectValid(categoryId)
                }
            }else{
                objectValid(data.category)
            }
        }
        if (Array.isArray(data.category)) {
            const categories = await Category.find({
                '_id': { $in: data.category }});
        
            if (categories.length !== data.category.length) {
                return res.status(404).send({
                    success: false,
                    message: 'One or more categories not found'
                });
            }
        } else {
            const existCategory = await Category.findById(data.category);
            if (!existCategory) {
                return res.status(404).send({
                    success: false,
                    message: 'Category not found'
                });
            }
        }
        const post = await Post.findByIdAndUpdate(id, data, { new: true })
        if (!post) {
            return res.status(404).send({
                success: false,
                message: 'Post not found'
            })
        }
        if (post.author != authorId) { 
            return res.status(403).send({
                success: false,
                message: 'You can only update your own post'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Post updated successfully',
            post: await Post.findById(id).select('-comments')
        });
    } catch (e) {
        console.error(e);
        if (e.message === 'Id is not a valid ObjectId') {
            return res.status(400).send({
                success: false,
                message: 'Invalid category ID format',
            });
        }   
        return res.status(500).send({ message: 'Internal Server Error' })
    }
}


export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        objectValid(id);

        // Buscar el post antes de eliminarlo
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send({
                success: false,
                message: "Post not found",
            });
        }

        // Validar que el usuario sea el autor del post
        if (post.author.toString() !== req.user.uid) {
            return res.status(403).send({
                success: false,
                message: "You can only delete your own post",
            });
        }

        // Eliminar todos los comentarios asociados a este post
        await Comment.deleteMany({ post: id });

        // Eliminar el post
        await Post.findByIdAndDelete(id);

        return res.status(200).send({
            success: true,
            message: "Post and its comments deleted successfully",
        });
    } catch (e) {
        console.error(e);
        if (e.message === "Id is not a valid ObjectId") {
            return res.status(400).send({
                success: false,
                message: "Invalid post ID format",
            });
        }
        return res.status(500).send({ message: "General server error", e });
    }
};
