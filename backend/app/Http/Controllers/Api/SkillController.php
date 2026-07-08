<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Skill, Experience, About, Testimonial, Contact, Setting};
use Illuminate\Http\Request;

// SkillController
class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::where('is_visible', true)->orderBy('order')->get();
        $grouped = $skills->groupBy('category');
        return response()->json(['data' => $grouped]);
    }
}
