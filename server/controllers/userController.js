const { clerkClient } = require("@clerk/express");
const Blog = require("../models/blogModel.js");
const Vote = require("../models/blogVoteModel.js");
const Comment = require("../models/blogComment.js");

exports.fetchUserData = async(req, res, next) => {
    try {
        const { userId } = req.params;
        let user = null;
        try {
            user = await clerkClient.users.getUser(userId);
        }
        catch(clerkError) {
            if (clerkError.status !== 404){
                console.log(clerkError);
                throw new Error("Error while fetching user details.");
            }
            
        }

        if(!user) {
            return res
            .status(404)
            .json({
                success: false,
                message: "User not found.",
            })
        }
        
        return res
        .status(200)
        .json({
            success: true,
            message: "User details fetched successfully.",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                profile_picture: user.imageUrl,
                lastActiveAt: user.lastActiveAt,
                username: user.username
            }
        })
    } catch(e) {
        console.log(e);

        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error."
        })
    }
}

exports.fetchUserBlogs = async(req, res, next) => {
    try {
        const { userId } = req.params;
        const { user } = req;
        if( userId === "[deleted]") {
            return res
            .status(400)
            .json({
                success: false,
                message: "Cannot fetch deleted user blogs."
            });
        }
        let blogs = await Blog.find({
            created_by: userId,
            isDeleted: false
        })
        .lean()
        .sort({createdAt: 1});

        blogs = await Promise.all(blogs.map(
            async(blog) => {
                let vote = await Vote.findOne({
                    blog_id: blog._id,
                    vote_by: user.id
                })
                .lean();

                return {
                    ...blog,
                    userVote: vote === null ? vote : vote.vote_type
                };
            })
        )
        return res
        .status(200)
        .json({
            success: true,
            message: "Blogs made by user with provided ID fetched successfully.",
            blogs: blogs
        });
    } catch (e) {
        console.log(e)

        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error."
        })
    }
}

exports.deleteBlog = async( req, res, next ) => {
    try {
        const { id } = req.params;
        const { user } = req;

        if (!id) {
            return res
            .status(400)
            .json({
                success: false,
                message: "ID is required."
            })
        }

        const blog = await Blog.findById(id);
        if(!blog || blog.isDeleted ) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Blog with provide ID not found."
            })
        }

        if (blog.created_by !== user.id) {
            return res
            .status(403)
            .json({
                success: false,
                message: "You are not creator of this blog."
            })
        }

        blog.isDeleted = true;
        await blog.save();
        return res
        .status(200)
        .json({
            success: true,
            message: "blog deleted successfully."
        })
    } catch (e) {
        console.log(e)

        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error."
        })
    }
}

exports.editComment = async (req, res) => {
    try {
        const { text, id } = req.body
        const { user } = req

        if (!(id && text)) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Comment ID and text is required."
            })
        }
        let comment = await Comment.findById(id);

        if(!comment || comment.isDeleted) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Comment with provided ID either deleted or not exist."
            });
        }

        if (comment.comment_by !== user.id) {
            return res
            .status(401)
            .json({
                success: false,
                message: "Unauthorized! You must be creator of comment to edit it."
            });
        }

        if (text === comment.text) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Comment text should be different from previously stored comment text."
            });
        }
        comment.text = text;
        await comment.save()

        return res
        .status(200)
        .json({
            success: true,
            message: "Comment updated successfully.",
        })
    } catch (e) {
        console.log(e)
        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error."
        })
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { user } = req;
        if (!id) {
            return res
            .status(400)
            .json({
                sucess: false,
                message: "ID is required."
            })
        }
        const comment = await Comment.findById(id);
        if (!comment || comment.isDeleted === true) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Comment with provided ID doesn't exist."
            })
        }

        if(comment.comment_by !== user.id) {
            return res
            .status(403)
            .json({
                success: false,
                message: "You are not creator of this comment."
            })
        }

        comment.isDeleted = true;
        await comment.save();
            
        return res
        .status(200)
        .json({
            succes: true,
            message: "Comment deleted sucessfully."
        })
    } catch (e) {
        console.log(e);

        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server Error."
        });
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { user } = req;
        await Blog.updateMany(
            { created_by: user.id },
            { created_by: "[deleted]" }
        );

        await Comment.updateMany(
            { comment_by : user.id },
            { comment_by: "[deleted]" }
        );

        await Vote.updateMany(
            { vote_by : user.id },
            { vote_by: "[deleted]" }
        );

        await clerkClient.users.deleteUser(user.id)
        return res
        .status(200)
        .json({
            success: true,
            message: "User account deleted."
        })
    } catch (e) {
        console.log(e);

        return res
        .status(500)
        .json({
            success: false,
           message: "Internal server error."
        });
    }

}