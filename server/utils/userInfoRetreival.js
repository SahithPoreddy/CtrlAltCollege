const { clerkClient } = require("@clerk/express")

exports.getUserData = async ( userId ) =>  {
    if (!userId) {
        throw new Error("User ID is required to fetch user data.");
    }
    let creatorUserName = "[deleted]";
    let creatorProfilePicture = null;
    
    if (userId === "[deleted]") {
        return {
            creatorProfilePicture: creatorProfilePicture,
            creatorUserName: creatorUserName
        };
    }

    const { username, imageUrl } = await clerkClient.users.getUser(userId);

    if (!(username && imageUrl)) {
        throw new Error("While fetching user data from clerk got username or image null");
    }

    return {
        creatorProfilePicture: imageUrl,
        creatorUserName: username
    };
}