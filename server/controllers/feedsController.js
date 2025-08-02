const Blog = require("../models/blogModel.js");
const Vote = require("../models/blogVoteModel.js");
const Comment = require("../models/blogComment.js");
const { getUserData } = require("../utils/userInfoRetreival.js");

exports.createBlog = async (req, res) => {
    try {
        const { user } = req;
        const { title, body, imagesUrls} = req.body;
        
        if (!title && !body && imagesUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Blog must have either a Title or Body or Images."
            });
        }

        const blog = await Blog.create({
            title: title,
            body: body,
            images: [...imagesUrls],
            created_by: user.id
        })

        return res
        .status(201)
        .json({
            success: true,
            message: "blog created successfully.",
            blog: blog
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

exports.voteBlog = async (req, res) => {
    try {
        const { id, voteType } = req.body;
        const { user } = req;

        if (!id || !voteType) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Blog ID and vote type are required."
            });
        }

        if (!(voteType === "upvote" || voteType === "downvote")) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Invalid vote type. Use 'upvote' or 'downvote'."
            });
        }

        const blog = await Blog.findById(id);

        if (!blog || blog.isDeleted) {
            return res.
            status(404)
            .json({
                success: false,
                message: "Blog with provided Blog ID either deleted or not exist."
            });
        }

        const existingVote = await Vote.findOne({
            blog_id: blog._id,
            vote_by: user.id
        });

        if (existingVote && existingVote.vote_type === voteType) {
            const deleteResult = await Vote.deleteOne({
                blog_id: existingVote.blog_id,
                vote_by: existingVote.vote_by
            });
            if (deleteResult.deletedCount === 1) {
                blog[voteType === "upvote" ? "upvote_count" : "downvote_count"] -= 1;
                await blog.save();

                return res
                .status(200)
                .json({
                    success: true,
                    message: `Vote removed successfully.`,
                    blog: blog
                });
            }
            else {
                throw new Error("Failed to delete existing vote.");
            }
        }

        else if (existingVote && existingVote.vote_type !== voteType) {
            existingVote.vote_type = voteType;
            await existingVote.save();

            blog[voteType === "upvote" ? "upvote_count" : "downvote_count"] += 1;
            blog[voteType === "upvote" ? "downvote_count" : "upvote_count"] -= 1;
            await blog.save();

            return res
            .status(200)
            .json({
                success: true,
                message: `Vote inverted successfully.`,
                blog: blog
            });
        }

        else {
            await Vote.create({
                blog_id: blog._id,
                vote_type: voteType,
                vote_by: user.id
            })

            blog[voteType === "upvote" ? "upvote_count" : "downvote_count"] += 1;
            await blog.save();

            return res
            .status(201)
            .json({
                success: true,
                message: "Vote created successfully.",
                blog: blog
            });
        }

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

exports.commentBlog = async (req, res) => {
    try {
        const { id, text, parentCommentId } = req.body;
        const { user } = req;

        if (!id || !text) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Blog ID and comment text are required."
            })
        }

        const blog = await Blog.findById(id);
        if (!blog || blog.isDeleted) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Blog with provided Blog ID either deleted or not exist."
            });
        }

        let parentComment = null;
        let replies = 0;
        if (parentCommentId) {
            parentComment = await Comment.findById(parentCommentId); 
            replies = await Comment.countDocuments({ 
                parent_comment_id: parentComment,
                blog_id: blog._id,
                isDeleted: false
            })
        }

        if (parentCommentId && (!parentComment ||( parentComment.isDeleted && replies === 0 ))) {
            return res
            .status(404)
            .json({
                success: false,
                message: "The comment you are trying to reply is either deleted or not found."
            });
        }

        else if (parentCommentId && parentComment.parent_comment_id !== null) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Can only reply direct comment."
            })
        }

        else {
            const comment = await Comment.create({
                blog_id: blog._id,
                comment_by: user.id,
                parent_comment_id: parentComment ? parentComment._id : null,
                text: text
            })
            
            blog.comment_count += 1;
            await blog.save();

            return res
            .status(201)
            .json({
                succes: true,
                message: "Comment added successfully.",
                comment: comment
            })
        }
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

exports.fetchBlog = async (req, res) => {
    try {
        const { user } = req;
        const { id } = req.query;
        let blogs = [];
        
        blogs = !id ?
        await Blog.find({
            isDeleted: false
        })
        .lean()
        .sort({ createdAt: -1 }) :
        await Blog.find({
            _id: id,
            isDeleted: false
        })
        .lean();

        if (!user) {
            return res
            .status(200)
            .json({
                success: true,
                message: "Blogs fetched successfully for unauthenticated user.",
                blogs: blogs.slice(0, blogs.length > 5 ? 5 : blogs.length)
            });
        }

        const blogsPromises = blogs.map(async(blog) => {
            try {
                const userVote = await Vote.findOne({
                    blog_id: blog._id,
                    vote_by: user.id
                })
                .lean();
                
                const { creatorUserName, creatorProfilePicture } = await getUserData(blog.created_by);

                return {
                    _id: blog._id,
                    title: blog.title,
                    body: blog.body,
                    images: blog.images,
                    upvote_count: blog.upvote_count,
                    downvote_count: blog.downvote_count,
                    comment_count: blog.comment_count,
                    creator_username: creatorUserName,
                    creator_profile_picture: creatorProfilePicture,
                    userVote: userVote ? userVote.vote_type : null
                };
            } catch (error) {
                console.log("Error while fetching user vote for blog ", blog._id, " error: ",error);
                return null;
            }
        })

        blogs = (await Promise.all(blogsPromises)).filter(blog => blog !== null)

        return res
        .status(200)
        .json({
            success: true,
            message: "Blogs fetched successfully.",
            blogs: blogs
        });
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

exports.fetchComments = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Blog ID is required."
            });
        }

        const blog = await Blog.findById(id);

        if (!blog || blog.isDeleted) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Blog with provided Blog ID either deleted or not exist."
            });
        }

        let comments = await Comment.find({
            blog_id: blog._id,
            parent_comment_id: null
        })
        .lean()
        .sort({ createdAt: 1 })

        const commentsPromises =  comments.map(async(comment) => {
            const replies = await Comment.find({
                blog_id: blog._id,
                parent_comment_id: comment._id,
                isDeleted: false
            })
            .lean()
            .sort({ createdAt: 1 })
            
            if (replies.length === 0 && comment.isDeleted === true) {
                return null;
            }
            
            const { creatorUserName, creatorProfilePicture } = await getUserData(comment.comment_by);
            comment.creator_username = creatorUserName;
            comment.creator_profile_picture = creatorProfilePicture;

            await Promise.all(
                replies.map(async(reply) => {
                    const { creatorUserName, creatorProfilePicture } = await getUserData(reply.comment_by);
                    reply.creator_username = creatorUserName;
                    reply.creator_profile_picture = creatorProfilePicture;
                })
            );
            return {
                ...comment,
                text: comment.isDeleted ? "[deleted]": comment.text,
                replies: replies
            } 
        })
        comments = (await Promise.all(commentsPromises)).filter((comment => !(comment === null)))
        return res
        .status(200).
        json({
            success: true,
            comments: comments
        });
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

