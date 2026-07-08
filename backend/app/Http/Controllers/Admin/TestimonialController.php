<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Testimonial::orderBy('order')->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:100',
            'role'         => 'required|string|max:100',
            'company'      => 'nullable|string|max:200',
            'content'      => 'required|string',
            'avatar'       => 'nullable|string',
            'rating'       => 'integer|min:1|max:5',
            'is_published' => 'boolean',
            'order'        => 'integer',
        ]);
        $t = Testimonial::create($validated);
        return response()->json(['data' => $t, 'message' => 'Testimonial created'], 201);
    }

    public function show(int $id)
    {
        return response()->json(['data' => Testimonial::findOrFail($id)]);
    }

    public function update(Request $request, int $id)
    {
        $request->merge([
            'is_published' => filter_var(
                $request->input('is_published'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),
        ]);
        $t = Testimonial::findOrFail($id);
        $t->update($request->validate([
            'name'         => 'sometimes|string|max:100',
            'role'         => 'sometimes|string|max:100',
            'company'      => 'nullable|string|max:200',
            'content'      => 'sometimes|string',
            'avatar'       => 'nullable|string',
            'rating'       => 'integer|min:1|max:5',
            'is_published' => 'boolean',
            'order'        => 'integer',
        ]));
        return response()->json(['data' => $t, 'message' => 'Testimonial updated']);
    }

    public function destroy(int $id)
    {
        Testimonial::findOrFail($id)->delete();
        return response()->json(['message' => 'Testimonial deleted']);
    }
}
