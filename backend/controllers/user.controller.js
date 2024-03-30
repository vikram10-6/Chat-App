import User from "../models/user.model.js"

export const getUsersForSidebar = async (req,resp)=>{
    try {
        const loggedInUserId = req.user._id
        // console.log("logged in user:",loggedInUserId)

        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password")

        resp.status(200).json(filteredUsers)
        
    } catch (error) {
        console.log("Error in getUsersForSidebar: ",error.message)
        resp.status(500).json({message:"Internal Server Error"})
    }
}