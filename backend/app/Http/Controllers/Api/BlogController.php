<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;

class BlogController extends Controller
{
    public function index()
    {
        $posts = BlogPost::published()
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->select(['id', 'title', 'slug', 'excerpt', 'cover_image', 'tags', 'published_at', 'created_at', 'views'])
            ->get();

        return response()->json(['data' => $posts]);
    }

    public function show(string $slug)
    {
        $post = BlogPost::published()->where('slug', $slug)->firstOrFail();
        $post->incrementViews();
        return response()->json(['data' => $post]);
    }
}
