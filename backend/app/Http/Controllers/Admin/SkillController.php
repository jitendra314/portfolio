<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Skill::orderBy('order')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'category'    => 'required|string|max:100',
            'proficiency' => 'required|integer|min:1|max:100',
            'icon'        => 'nullable|string',
            'color'       => 'nullable|string',
            'order'       => 'integer',
            'is_visible'  => 'boolean',
        ]);
        $skill = Skill::create($validated);
        return response()->json(['data' => $skill, 'message' => 'Skill created'], 201);
    }

    public function show(int $id)
    {
        return response()->json(['data' => Skill::findOrFail($id)]);
    }

    public function update(Request $request, int $id)
    {
        $request->merge([
            'is_visible' => filter_var(
                $request->input('is_visible'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),
        ]);
        $skill = Skill::findOrFail($id);
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:100',
            'category'    => 'sometimes|string|max:100',
            'proficiency' => 'sometimes|integer|min:1|max:100',
            'icon'        => 'nullable|string',
            'color'       => 'nullable|string',
            'order'       => 'integer',
            'is_visible'  => 'boolean',
        ]);
        $skill->update($validated);
        return response()->json(['data' => $skill, 'message' => 'Skill updated']);
    }

    public function destroy(int $id)
    {
        Skill::findOrFail($id)->delete();
        return response()->json(['message' => 'Skill deleted']);
    }
}
