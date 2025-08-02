const { Router } = require("express");
const { auth, optionalAuth } = require("../middlewares/authMiddleware.js");
const { createBlog, voteBlog, commentBlog, fetchBlog, fetchComments } = require("../controllers/feedsController.js");
const { multipleUpload } = require("../middlewares/filesUpload.js");
const { multerErrorHandler } = require("../middlewares/errorHandler.js");
const { uploadToS3 } = require("../middlewares/S3Middleware.js");

const router = Router();

router
.route("/create/blog")
.post(
    auth, 
    multipleUpload,
    multerErrorHandler,
    uploadToS3, 
    createBlog
);

router
.route("/vote/blog")
.post(
    auth,
    voteBlog
);

router
.route("/comment/blog")
.post(
    auth,
    commentBlog
);

router
.route("/fetch/blogs?:id")
.get(
    optionalAuth,
    fetchBlog
);

router
.route("/fetch/comments/:id")
.get(
    auth,
    fetchComments
);


module.exports = router;