<?php

namespace App\Http\Controllers;

use App\Models\MessageAttachment;
use App\Models\TeacherConversation;
use App\Models\TeacherMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TeacherMessageController extends Controller
{
    public function contacts(Request $request)
    {
        $role = strtolower((string) $request->user()->role);
        $allowedRole = $role === 'admin' ? 'teacher' : 'admin';

        return response()->json(User::query()
            ->where('role', $allowedRole)
            ->with('teacher:id,user_id,first_name,last_name,photo')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'role']));
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $conversations = TeacherConversation::query()
            ->whereHas('participants', fn ($query) => $query->whereKey($userId))
            ->with('participants:id,first_name,last_name,role')
            ->withCount(['messages as unread_count' => fn ($query) => $query
                ->where('sender_id', '!=', $userId)
                ->whereNull('read_at')])
            ->with('latestMessage.sender:id,first_name,last_name')
            ->withMax('messages', 'created_at')
            ->orderByDesc('messages_max_created_at')
            ->get();

        return response()->json($conversations->map(fn (TeacherConversation $conversation) => [
            'id' => $conversation->id,
            'subject' => $conversation->subject,
            'participants' => $conversation->participants,
            'last_message' => $conversation->latestMessage,
            'unread_count' => (int) $conversation->unread_count,
            'updated_at' => $conversation->messages_max_created_at,
        ])->values());
    }

    public function unreadCount(Request $request)
    {
        $count = TeacherMessage::query()
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->whereHas('conversation.participants', fn ($query) => $query->whereKey($request->user()->id))
            ->count();

        return response()->json(['count' => $count]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'recipient_id' => ['required', 'integer', 'exists:users,id'],
            'subject' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
            'attachment' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx,odt,ods', 'max:10240'],
        ]);

        $sender = $request->user();
        $recipient = User::query()->whereKey($data['recipient_id'])->firstOrFail();
        abort_unless($this->canContact($sender, $recipient), 403, 'Destinataire non autorisé.');

        $message = DB::transaction(function () use ($request, $data, $sender, $recipient) {
            $conversation = $this->findOrCreateConversation($sender, $recipient, $data['subject'] ?? null);
            return $this->createMessage($request, $conversation, $sender->id, $data['body']);
        });

        return response()->json($message->load(['sender', 'attachments']), 201);
    }

    public function show(Request $request, TeacherConversation $conversation)
    {
        $this->authorizeParticipant($request, $conversation);
        $conversation->messages()->where('sender_id', '!=', $request->user()->id)->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json($conversation->load([
            'participants:id,first_name,last_name,role',
            'messages' => fn ($query) => $query->with(['sender:id,first_name,last_name', 'attachments'])->oldest(),
        ]));
    }

    public function reply(Request $request, TeacherConversation $conversation)
    {
        $this->authorizeParticipant($request, $conversation);
        $data = $request->validate([
            'body' => ['required', 'string', 'max:10000'],
            'attachment' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx,odt,ods', 'max:10240'],
        ]);

        $message = DB::transaction(fn () => $this->createMessage($request, $conversation, $request->user()->id, $data['body']));
        return response()->json($message->load(['sender', 'attachments']), 201);
    }

    public function downloadAttachment(Request $request, TeacherMessage $message, MessageAttachment $attachment)
    {
        $conversation = $message->conversation;
        $this->authorizeParticipant($request, $conversation);
        abort_unless((int) $attachment->message_id === (int) $message->id, 404);
        abort_unless(Storage::disk('private')->exists($attachment->file_path), 404);

        return Storage::disk('private')->download($attachment->file_path, $attachment->file_name, ['Content-Type' => $attachment->mime_type]);
    }

    private function canContact(User $sender, User $recipient): bool
    {
        $senderRole = strtolower((string) $sender->role);
        $recipientRole = strtolower((string) $recipient->role);
        return ($senderRole === 'teacher' && $recipientRole === 'admin')
            || ($senderRole === 'admin' && $recipientRole === 'teacher');
    }

    private function findOrCreateConversation(User $sender, User $recipient, ?string $subject): TeacherConversation
    {
        $conversation = TeacherConversation::query()
            ->whereHas('participants', fn ($query) => $query->whereKey($sender->id))
            ->whereHas('participants', fn ($query) => $query->whereKey($recipient->id))
            ->has('participants', '=', 2)
            ->first();

        if ($conversation) {
            return $conversation;
        }

        $conversation = TeacherConversation::create(['subject' => $subject]);
        $conversation->participants()->attach([$sender->id, $recipient->id]);
        return $conversation;
    }

    private function createMessage(Request $request, TeacherConversation $conversation, int $senderId, string $body): TeacherMessage
    {
        $message = $conversation->messages()->create(['sender_id' => $senderId, 'body' => $body]);
        $conversation->touch();

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $message->attachments()->create([
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $file->store('message-attachments/' . $conversation->id, 'private'),
                'mime_type' => $file->getMimeType() ?: 'application/octet-stream',
                'file_size' => $file->getSize(),
            ]);
        }

        return $message;
    }

    private function authorizeParticipant(Request $request, TeacherConversation $conversation): void
    {
        abort_unless($conversation->participants()->whereKey($request->user()->id)->exists(), 403);
    }
}
