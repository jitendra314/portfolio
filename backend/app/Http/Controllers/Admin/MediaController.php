<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,webp,svg,pdf|max:10240',
        ]);

        $file = $request->file('file');
        $folder = $request->input('folder', 'uploads');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("public/{$folder}", $filename);
        $url = Storage::url($path);

        return response()->json([
            'url'      => $url,
            'filename' => $filename,
            'path'     => $path,
        ], 201);
    }
}
