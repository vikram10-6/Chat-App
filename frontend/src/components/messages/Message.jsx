import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../store/useConversation";

const Message = ({message}) => {
  const { authUser } = useAuthContext(); //to check where the message came from
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePic} alt="Tailwind CSS chat buble component" />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor}`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        Seen at 12:46
      </div>
    </div>
  );
};

export default Message;
