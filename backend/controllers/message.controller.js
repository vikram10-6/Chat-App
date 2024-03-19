import Conversation from "../models/conversation.model.js";
import Message from "../models/message.modal.js";

export const sendMessage = async (req, resp) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    
    
    await  Promise.all([conversation.save(),newMessage.save()])
  } catch (error) {
    console.log("sM error", error.message);
    resp.status(500).json({ error: "Internal server error" });
  }
};
