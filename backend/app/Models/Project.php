<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'long_description',
        'thumbnail', 'images', 'tech_stack', 'github_url',
        'live_url', 'is_featured', 'is_published', 'order',
        'category', 'start_date', 'end_date',
    ];

    protected $casts = [
        'images'      => 'array',
        'tech_stack'  => 'array',
        'is_featured' => 'boolean',
        'is_published'=> 'boolean',
        'start_date'  => 'date',
        'end_date'    => 'date',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
