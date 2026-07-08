<?php namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\About;
class AboutController extends Controller {
    public function show() {
        $about = About::first();
        return response()->json(['data' => $about]);
    }
}
