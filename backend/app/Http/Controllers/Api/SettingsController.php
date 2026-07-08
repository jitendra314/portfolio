<?php namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Setting;
class SettingsController extends Controller {
    public function public() {
        $settings = Setting::whereIn('key', ['site_title','site_description','hero_tagline','maintenance_mode'])->pluck('value','key');
        return response()->json(['data' => $settings]);
    }
}
