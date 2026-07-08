<?php namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
class ContactController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:2000',
        ]);
        $validated['ip_address'] = $request->ip();
        Contact::create($validated);
        return response()->json(['message' => 'Message sent successfully!'], 201);
    }
}
