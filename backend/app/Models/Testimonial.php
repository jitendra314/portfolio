<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['name', 'role', 'company', 'content', 'avatar', 'rating', 'is_published', 'order'];

    protected $casts = [
        'rating'       => 'integer',
        'is_published' => 'boolean',
    ];
}
