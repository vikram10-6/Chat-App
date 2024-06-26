import Conversation from "../models/conversation.model.js";
import Message from "../models/message.modal.js";
import { getReceiverSocketId,io } from "../socket/socket.js";

export const sendMessage = async (req, resp) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
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
    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    resp.status(201).json(newMessage);
  } catch (error) {
    console.log("sM error", error.message);
    resp.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, resp) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    if (!conversation) return resp.status(200).json([]);
    resp.status(200).json(conversation.messages);
  } catch (error) {
    console.log("gM error", error.message);
    resp.status(500).json({ error: "Internal server error" });
  }
};
