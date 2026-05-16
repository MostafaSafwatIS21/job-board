import { useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import ChatWindow from "@/components/ChatWindow";

type LocationState = {
  contactName?: string;
};

const ChatConversation = () => {
  const { contactId } = useParams();
  const location = useLocation();
  const authUser = useAppSelector((state) => state.auth.user);
  const contactName = (location.state as LocationState | null)?.contactName;

  if (!authUser || !contactId) {
    return (
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Chat unavailable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Chat</h2>
        <p className="text-sm text-muted-foreground">
          {contactName ? `Conversation with ${contactName}` : "Conversation"}
        </p>
      </div>
      <ChatWindow
        currentUser={{ id: authUser.id, name: authUser.name }}
        activeContact={{ id: contactId, name: contactName }}
      />
    </div>
  );
};

export default ChatConversation;
