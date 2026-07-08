<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Project, Skill, Experience, Contact, Testimonial, BlogPost};

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'data' => [
                'projects'        => Project::count(),
                'published'       => Project::where('is_published', true)->count(),
                'featured'        => Project::where('is_featured', true)->count(),
                'skills'          => Skill::count(),
                'experiences'     => Experience::count(),
                'messages'        => Contact::count(),
                'unread_messages' => Contact::where('is_read', false)->count(),
                'testimonials'    => Testimonial::count(),
                'blog_posts'      => BlogPost::count(),
                'published_posts' => BlogPost::where('is_published', true)->count(),
            ]
        ]);
    }
}
