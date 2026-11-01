<?php

namespace App\Http\Controllers;

use App\Models\TeacherConversation;
use App\Models\TeacherMessage;
use App\Models\User;
use Illuminate\Http\Request;

class TeacherMessageController extends Controller
{
    public function recipients()
    {
        return response()->json(User::where('role', 'admin')->get(['id', 'firstName', 'lastName']));
    }

    public function index(Request $request)
    {
        return response()->json(
            TeacherConversation::with(['participants', 'messages' => fn ($query) => $query->latest()])
                ->whereHas('participants', fn ($query) => $query->where('users.id', $request->user()->id))
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'recipient_id' => 'required|integer|exists:users,id',
            'subject' => 'nullable|string|max:255',
            'body' => 'required|string|max:10000',
        ]);
        $recipient = User::whereKey($data['recipient_id'])->where('role', 'admin')->firstOrFail();

        $conversation = TeacherConversation::create(['subject' => $data['subject'] ?? null]);
        $conversation->participants()->attach([$request->user()->id, $recipient->id]);
        $message = $conversation->messages()->create([
            'sender_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        return response()->json($message->load('sender'), 201);
    }

    public function show(Request $request, TeacherConversation $conversation)
    {
        abort_unless($conversation->participants()->whereKey($request->user()->id)->exists(), 403);

        $conversation->messages()->where('sender_id', '!=', $request->user()->id)->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json($conversation->load(['participants', 'messages.sender']));
    }

    public function reply(Request $request, TeacherConversation $conversation)
    {
        abort_unless($conversation->participants()->whereKey($request->user()->id)->exists(), 403);

        $data = $request->validate(['body' => 'required|string|max:10000']);

        return response()->json($conversation->messages()->create([
            'sender_id' => $request->user()->id,
            'body' => $data['body'],
        ])->load('sender'), 201);
    }
}
