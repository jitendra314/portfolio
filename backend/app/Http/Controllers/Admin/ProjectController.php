<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('order')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $projects]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:200',
            'description'      => 'required|string',
            'long_description' => 'nullable|string',
            'thumbnail'        => 'nullable|string',
            'images'           => 'nullable|array',
            'tech_stack'       => 'nullable|array',
            'github_url'       => 'nullable|url',
            'live_url'         => 'nullable|url',
            'is_featured'      => 'boolean',
            'is_published'     => 'boolean',
            'order'            => 'integer',
            'category'         => 'nullable|string',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $project = Project::create($validated);

        return response()->json(['data' => $project, 'message' => 'Project created'], 201);
    }

    public function show(int $id)
    {
        return response()->json(['data' => Project::findOrFail($id)]);
    }

    public function update(Request $request, int $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'sometimes|string|max:200',
            'description'      => 'sometimes|string',
            'long_description' => 'nullable|string',
            'thumbnail'        => 'nullable|string',
            'images'           => 'nullable|array',
            'tech_stack'       => 'nullable|array',
            'github_url'       => 'nullable|url',
            'live_url'         => 'nullable|url',
            'is_featured'      => 'boolean',
            'is_published'     => 'boolean',
            'order'            => 'integer',
            'category'         => 'nullable|string',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        }

        $project->update($validated);
        return response()->json(['data' => $project, 'message' => 'Project updated']);
    }

    public function destroy(int $id)
    {
        Project::findOrFail($id)->delete();
        return response()->json(['message' => 'Project deleted']);
    }

    public function toggleFeatured(int $id)
    {
        $project = Project::findOrFail($id);
        $project->update(['is_featured' => !$project->is_featured]);
        return response()->json(['data' => $project, 'message' => 'Updated']);
    }
}
