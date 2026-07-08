<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $fillable = [
        'name', 'title', 'bio', 'avatar', 'resume_url',
        'social_links', 'location', 'email', 'phone',
        'years_experience', 'projects_completed', 'clients_served',
        'open_to_work',
    ];

    protected $casts = [
        'social_links'       => 'array',
        'open_to_work'       => 'boolean',
        'years_experience'   => 'integer',
        'projects_completed' => 'integer',
        'clients_served'     => 'integer',
    ];
}
