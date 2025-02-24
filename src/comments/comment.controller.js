import { objectValid } from '../../utils/db.validators.js'
import Comment from './comment.model.js'
import Post from '../posts/post.model.js'


export const addComment = async (req, res) => {
    try {
        const { post, ...data } = req.body
        objectValid(post);
        const existPost = await Post.findById(post);
        if (!existPost) {
            return res.status(400).send({
                success: false,
                message: "Post not found",
            });
        }
        const author = req.user.uid
        data.author = author
        data.post = post;
        const comment = new Comment(data)
        await comment.save();
        await Post.findByIdAndUpdate(post, { $push: { comment: comment._id } })
        return res.status(200).send({
            success: true,
            message: "Comment saved successfully",
            comment,
        })
    } catch (e) {
        console.error(e)
        if (e.message === "Id is not a valid ObjectId") {
            return res.status(400).send({
                success: false,
                message: "Invalid category ID format",
            })
        }
        return res.status(500).send({ message: "General server error", e })
    }
}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body
        const userId = req.user.uid
        objectValid(id);
        const existingComment = await Comment.findById(id)
        if (!existingComment) {
            return res.status(404).send({
                success: false,
                message: "Comment not found",
            })
        }
        if (existingComment.author.toString() !== userId) {
            return res.status(403).send({
                success: false,
                message: "You can only update your own comment",
            });
        }
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { comment },
            { new: true }
        )

        return res.status(200).send({
            success: true,
            message: "Comment updated successfully",
            updatedComment,
        })
    } catch (e) {
        console.error(e)
        if (e.message === "Id is not a valid ObjectId") {
            return res.status(400).send({
                success: false,
                message: "Invalid comment ID format",
            })
        }
        return res.status(500).send({ message: "General server error", e });
    }
}



export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        objectValid(id)
        const comment = await Comment.findOneAndDelete({ _id: id, author: req.user.uid })
        if (!comment) {
            return res.status(404).send({
                success: false,
                message: "Comment not found or you are not the author",
            })
        }
        await Post.updateMany(
            { comment: id },
            { $pull: { comment: id } }
        )
        return res.status(200).send({
            success: true,
            message: "Comment deleted successfully",
        })
    } catch (e) {
        console.error(e);
        if (e.message === "Id is not a valid ObjectId") {
            return res.status(400).send({
                success: false,
                message: "Invalid comment ID format",
            })
        }
        return res.status(500).send({ message: "General server error", e });
    }
}
