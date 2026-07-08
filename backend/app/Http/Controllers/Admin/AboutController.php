<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function show()
    {
        return response()->json(['data' => About::firstOrCreate([])]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name'               => 'sometimes|string|max:100',
            'title'              => 'sometimes|string|max:200',
            'bio'                => 'sometimes|string',
            'avatar'             => 'nullable|string',
            'resume_url'         => 'nullable|string',
            'social_links'       => 'nullable|array',
            'location'           => 'nullable|string',
            'email'              => 'nullable|email',
            'phone'              => 'nullable|string',
            'years_experience'   => 'nullable|integer',
            'projects_completed' => 'nullable|integer',
            'clients_served'     => 'nullable|integer',
            'open_to_work'       => 'boolean',
        ]);

        $about = About::firstOrCreate([]);
        $about->update($validated);
        return response()->json(['data' => $about, 'message' => 'About updated']);
    }
}
