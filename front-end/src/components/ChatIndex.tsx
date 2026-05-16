import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getApiErrorMessage } from "@/utils/api";
import { Button } from "@/components/ui/button";

type ThreadContact = {
  id: number;
  name: string;
  avatar?: string | null;
};

type ThreadMessage = {
  id: number;
  sender_id: number;
  receiver_id: number;
  body: string;
  created_at: string;
};

type ThreadItem = {
  contact: ThreadContact;
  last_message: ThreadMessage;
};

type ThreadsResponse = {
  data: ThreadItem[];
};

const ChatIndex = () => {
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    api
      .get<ThreadsResponse>("/messages/threads")
      .then((res) => {
        if (!isMounted) return;
        setThreads(res.data.data ?? []);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(getApiErrorMessage(err));
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Loading chats…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">No chats yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border/70 bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Chats</h2>
        <p className="text-sm text-muted-foreground">Recent conversations</p>
      </div>
      <div className="space-y-3">
        {threads.map((thread) => (
          <button
            key={thread.contact.id}
            type="button"
            onClick={() =>
              navigate(`/chat/${thread.contact.id}`, {
                state: { contactName: thread.contact.name },
              })
            }
            className="w-full text-left"
          >
            <div className="flex items-center justify-between border border-border/70 bg-card px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-full bg-muted">
                  {thread.contact.avatar ? (
                    <img
                      src={thread.contact.avatar}
                      alt={thread.contact.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-medium">{thread.contact.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {thread.last_message.body}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatIndex;
