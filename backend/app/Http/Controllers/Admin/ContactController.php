<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $contacts]);
    }

    public function markRead(int $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->update(['is_read' => true]);
        return response()->json(['data' => $contact]);
    }

    public function destroy(int $id)
    {
        Contact::findOrFail($id)->delete();
        return response()->json(['message' => 'Message deleted']);
    }
}
