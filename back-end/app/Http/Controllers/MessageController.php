<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\UserNotified;
use App\Models\Application;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contactId = request()->query("contact_id");
        if (!$contactId) {
            return response()->json(
                ["message" => "contact_id is required"],
                422,
            );
        }

        $userId = auth()->id();
        $contact = User::find($contactId);
        if (!$contact) {
            return response()->json(
                ["message" => "Contact not found"],
                404,
            );
        }

        if (!$this->canChat($userId, (int) $contactId)) {
            return response()->json(
                ["message" => "Chat not allowed"],
                403,
            );
        }
        $messages = Message::where(function ($query) use ($userId, $contactId) {
            $query
                ->where("sender_id", $userId)
                ->where("receiver_id", $contactId);
        })
            ->orWhere(function ($query) use ($userId, $contactId) {
                $query
                    ->where("sender_id", $contactId)
                    ->where("receiver_id", $userId);
            })
            ->orderBy("created_at")
            ->get();

        return response()->json(["data" => $messages], 200);
    }

    public function threads()
    {
        $userId = auth()->id();

        $messages = Message::where("sender_id", $userId)
            ->orWhere("receiver_id", $userId)
            ->orderByDesc("created_at")
            ->get();

        $contactIds = $messages
            ->map(function (Message $message) use ($userId) {
                return $message->sender_id === $userId
                    ? $message->receiver_id
                    : $message->sender_id;
            })
            ->unique()
            ->values();

        $contacts = User::whereIn("id", $contactIds)
            ->get(["id", "name", "avatar"])
            ->keyBy("id");

        $threads = $contactIds
            ->map(function ($contactId) use ($messages, $contacts, $userId) {
                $lastMessage = $messages->first(function (Message $message) use (
                    $userId,
                    $contactId,
                ) {
                    return (
                        $message->sender_id === $userId &&
                        $message->receiver_id === $contactId
                    ) || (
                        $message->sender_id === $contactId &&
                        $message->receiver_id === $userId
                    );
                });

                return [
                    "contact" => $contacts->get($contactId),
                    "last_message" => $lastMessage,
                ];
            })
            ->filter(function (array $thread) {
                return $thread["contact"] !== null && $thread["last_message"];
            })
            ->values();

        return response()->json(["data" => $threads], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body' => 'required|string',
        ]);

        $userId = auth()->id();
        if (!$this->canChat($userId, (int) $request->receiver_id)) {
            return response()->json(
                ["message" => "Chat not allowed"],
                403,
            );
        }

        $receiverId = (int) $request->receiver_id;
        $hasConversation = Message::where(function ($query) use (
            $userId,
            $receiverId,
        ) {
            $query
                ->where("sender_id", $userId)
                ->where("receiver_id", $receiverId);
        })
            ->orWhere(function ($query) use ($userId, $receiverId) {
                $query
                    ->where("sender_id", $receiverId)
                    ->where("receiver_id", $userId);
            })
            ->exists();

        $message = Message::create([
            'sender_id' => $userId,
            'receiver_id' => $receiverId,
            'body' => $request->body,
        ]);

        // Broadcast the real-time event via Reverb
        broadcast(new MessageSent($message));

        if (!$hasConversation) {
            $senderName = $request->user()?->name ?? "Someone";
            $notification = Notification::create([
                "user_id" => $receiverId,
                "title" => "New chat started",
                "body" => $senderName . " started a chat with you.",
                "read" => false,
            ]);
            broadcast(new UserNotified($notification));
        }

        return response()->json($message, 201);
    }

    private function canChat(int $userId, int $contactId): bool
    {
        return Application::where("candidate_id", $contactId)
            ->whereHas("job", function ($query) use ($userId) {
                $query->where("employer_id", $userId);
            })
            ->exists() ||
            Application::where("candidate_id", $userId)
                ->whereHas("job", function ($query) use ($contactId) {
                    $query->where("employer_id", $contactId);
                })
                ->exists();
    }
    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        //
    }
}
