const { getAuth, clerkClient } = require("@clerk/express");

exports.auth = async(req, res, next) => {
    try {
        const authObject = getAuth(req);
        const { userId } = authObject;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        let user = null;
        try {
            user = await clerkClient.users.getUser(userId);
        } 
        catch(clerkError) {
            if (clerkError.status !== 404) {
                console.log(clerkError)
                throw new Error ("Error occurred while fetching user from clerk")
            }
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        req.user = user;
        next();
    }
    catch(e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        })
    }
}

exports.optionalAuth = async(req, res, next) => {
    try {
        const authObject = getAuth(req);
        const { userId } = authObject;
        if (!userId) {
            req.user = null;
            return next();
        }
        const user = await clerkClient.users.getUser(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID User not found."
            });
        }
        req.user = user;
        next();
    }
    catch(e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        })
    }
}