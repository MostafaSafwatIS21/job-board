<?php

namespace App\Http\Controllers;

use App\Events\UserNotified;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Notification::where("user_id", auth()->id())->get(),
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "title" => "required|string|max:255",
            "body" => "required|string",
        ]);

        $notification = Notification::create([
            "user_id" => auth()->id(),
            "title" => $request->input("title"),
            "body" => $request->input("body"),
            "read" => false,
        ]);

        broadcast(new UserNotified($notification));

        return response()->json($notification, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        // mark as read
        if ($notification->user_id !== auth()->id()) {
            return response()->json(["error" => "Unauthorized"], 403);
        }
        $notification->update(["read" => true]);
        return response()->json($notification);
    }

    /**
     * Update the specified resource in storage.
     */

    // will be read and unreads
    public function update(Request $request, Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            return response()->json(["error" => "Unauthorized"], 403);
        }

        $request->validate([
            "read" => "required|boolean",
        ]);

        $notification->update(["read" => $request->input("read")]);
        return response()->json($notification);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            return response()->json(["error" => "Unauthorized"], 403);
        }
        $notification->delete();
        return response()->json(["message" => "Notification deleted"]);
    }
}
