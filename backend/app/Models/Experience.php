<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'company', 'role', 'description', 'responsibilities',
        'tech_used', 'start_date', 'end_date', 'is_current',
        'company_logo', 'company_url', 'location', 'type', 'order',
    ];

    protected $casts = [
        'responsibilities' => 'array',
        'tech_used'        => 'array',
        'start_date'       => 'date',
        'end_date'         => 'date',
        'is_current'       => 'boolean',
    ];
}
