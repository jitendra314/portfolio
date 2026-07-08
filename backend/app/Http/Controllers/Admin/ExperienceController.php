<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Experience::orderBy('start_date', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company'          => 'required|string|max:200',
            'role'             => 'required|string|max:200',
            'description'      => 'required|string',
            'responsibilities' => 'nullable|array',
            'tech_used'        => 'nullable|array',
            'start_date'       => 'required|date',
            'end_date'         => 'nullable|date',
            'is_current'       => 'boolean',
            'company_logo'     => 'nullable|string',
            'company_url'      => 'nullable|url',
            'location'         => 'nullable|string',
            'type'             => 'nullable|in:full-time,part-time,freelance,internship,contract',
            'order'            => 'integer',
        ]);
        $exp = Experience::create($validated);
        return response()->json(['data' => $exp, 'message' => 'Experience created'], 201);
    }

    public function show(int $id)
    {
        return response()->json(['data' => Experience::findOrFail($id)]);
    }

    public function update(Request $request, int $id)
    {
        $exp = Experience::findOrFail($id);
        $validated = $request->validate([
            'company'          => 'sometimes|string|max:200',
            'role'             => 'sometimes|string|max:200',
            'description'      => 'sometimes|string',
            'responsibilities' => 'nullable|array',
            'tech_used'        => 'nullable|array',
            'start_date'       => 'sometimes|date',
            'end_date'         => 'nullable|date',
            'is_current'       => 'boolean',
            'company_logo'     => 'nullable|string',
            'company_url'      => 'nullable|url',
            'location'         => 'nullable|string',
            'type'             => 'nullable|in:full-time,part-time,freelance,internship,contract',
            'order'            => 'integer',
        ]);
        $exp->update($validated);
        return response()->json(['data' => $exp, 'message' => 'Experience updated']);
    }

    public function destroy(int $id)
    {
        Experience::findOrFail($id)->delete();
        return response()->json(['message' => 'Experience deleted']);
    }
}
