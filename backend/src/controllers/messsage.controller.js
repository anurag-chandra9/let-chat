import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {

    try {
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
        
    } catch (error) {
        console.log("Error in getUserForSidebar",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getMessages = async (req, res) => {
    
    try {
        const {id:userTOChatId}=req.params;
        const myId=req.user._id;
        const messages= await Message.find({
            $or:[
                {senderId:myId,receiverId:userTOChatId},
                {senderId:userTOChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages",error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }};
    
export const sendMessage = async (req, res) => {
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
           
        if(image){
            //upload base64 image to cloudinary      
          const uploadedResponse=await cloudinary.uploader.upload(image);
          imageUrl=uploadedResponse.secure_url;
        
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
            });
       await newMessage.save();

 
    const receiverSocketId = getReceiverSocketId(receiverId);
console.log("Receiver Socket ID:", receiverSocketId); // Debugging line

try {
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
        console.log("Message sent to:", receiverSocketId);
    } else {
        console.error("Receiver socket ID is not found.");
    }
} catch (error) {
    console.error("Error emitting new message:", error);
}

       res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage",error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }
};