<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Experience::orderBy('is_current', 'desc')
            ->orderBy('start_date', 'desc')
            ->get();
        return response()->json(['data' => $experiences]);
    }
}
