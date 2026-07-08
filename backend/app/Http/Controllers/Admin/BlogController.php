<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index()
    {
        $posts = BlogPost::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $posts]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'excerpt'      => 'nullable|string',
            'content'      => 'required|string',
            'cover_image'  => 'nullable|string',
            'tags'         => 'nullable|array',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);

        if (($validated['is_published'] ?? false) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = BlogPost::create($validated);
        return response()->json(['data' => $post, 'message' => 'Post created'], 201);
    }

    public function show(int $id)
    {
        return response()->json(['data' => BlogPost::findOrFail($id)]);
    }

    public function update(Request $request, int $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'excerpt'      => 'nullable|string',
            'content'      => 'sometimes|string',
            'cover_image'  => 'nullable|string',
            'tags'         => 'nullable|array',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        }

        if (($validated['is_published'] ?? false) && !$post->published_at && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post->update($validated);
        return response()->json(['data' => $post, 'message' => 'Post updated']);
    }

    public function destroy(int $id)
    {
        BlogPost::findOrFail($id)->delete();
        return response()->json(['message' => 'Post deleted']);
    }
}
