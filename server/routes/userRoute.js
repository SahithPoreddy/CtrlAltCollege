const { Router } = require("express");
const { auth } = require("../middlewares/authMiddleware");
const { fetchUserData, fetchUserBlogs, editComment, deleteBlog, deleteComment, deleteUser } = require("../controllers/userController");

const router = Router();

router
.route("/info/:userId")
.get(
    auth,
    fetchUserData
);

router
.route("/blogs/:userId")
.get(
    auth,
    fetchUserBlogs
);

router
.route("/delete/blog/:id")
.delete(
    auth,
    deleteBlog
);

router
.route("/edit/comment")
.put(
    auth,
    editComment
);

router
.route("/delete/comment/:id")
.delete(
    auth,
    deleteComment
);

router
.route("/delete/account")
.delete
(
    auth,
    deleteUser
)
module.exports = router;