<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload(Request $request, string $folder = 'uploads', array $mimes ,int $max = 5120)
    {
        $file   = $request->file('file');


        // Store with a unique name
        $path = Storage::disk('s3')->putFileAs(
            $folder,
            $file,
            uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension(),
        );

        if (!$path) {
            return response()->json(['message' => 'Upload failed',"res"=>$request], 500);
        }

        $url = Storage::disk('s3')->url($path);

        return $url;
    }

    public function uploadLogos(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,png,webp,pdf|max:5120'
        ]);

        $employer = $request->user()->employerProfile;


        $url =  $this->upload($request, 'logos', ['image/jpeg', 'image/png'], 2048);

        if (isset($url['url'])) {
            $employer->company_logo = $url;
            $employer->save();
        }

        return response()->json(["message" => "Logo uploaded successfully", "data" => $employer], 200);


    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,png,webp,pdf|max:5120'
            ]);


        return $this->upload($request, 'avatars', ['image/jpeg', 'image/png'], 2048);
    }
}
