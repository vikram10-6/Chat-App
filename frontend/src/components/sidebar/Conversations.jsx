import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = () => {
  const{loading,conversations} = useGetConversations()
  console.log("CONVERSATONS: ",conversations)
  return (
    <div className="py-2 flex flex-col overflow-auto scrollbar-hide">
      {conversations.map((conversation)=>(
        <Conversation 
        key={conversation._id}
        conversation = {conversation}
        
        />
      ))}
      {loading?<span className="loading loading-spinner mx-auto"></span>:null}
    </div>
  );
};
export default Conversations;
