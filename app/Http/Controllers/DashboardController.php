<?php

namespace App\Http\Controllers;

use App\Models\Shortlink;
use App\Rules\SafeFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class DashboardController extends Controller
{
    public function Index(){
        return Inertia::render("Dashboard",[]);
    }
    public function Create(Request $request){
        $validator = Validator::make(
            $request->all(), 
            [
                'slug' => ['required','regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/i','unique:shortlink,slug'],
                'url' => ['required','regex:/^https?:\/\/[^\s$.?#].[^\s]*$/i'],
                // 'file' => ['nullable', 'file', 'max:5120'], //, new SafeFile(['image/jpeg', 'image/png', 'image/gif', 'image/bmp'])
            ],
            [
                'slug.required' => 'Slug wajib diisi.',
                'slug.regex' => 'Slug hanya boleh berisi huruf, angka, dan tanda minus (-), tanpa karakter spesial.',
                'slug.unique' => 'Slug sudah digunakan, silakan gunakan slug lain.',

                'url.required' => 'URL wajib diisi.',
                'url.regex' => 'Format URL tidak valid. Harus dimulai dengan http:// atau https://',

                // 'file.file' => 'File harus berupa berkas yang valid.',
                // 'file.max' => 'Ukuran file maksimal 5MB.',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                "Title" => "dashboard.invalidValidation",
                "Detail" => $validator->errors(),
            ], 500);
        }

        try {
            // if($request->has("file") && $request->hasFile("file")){
            //     $uuid = Uuid::uuid4()->toString();
            //     $fileFoto = $uuid.".".strtolower($request->file("file")->getClientOriginalExtension());
            //     $request->file("file")->storeAs('/', $fileFoto, ['disk' => "file"]);
                
            //     chmod(public_path('file/' . $fileFoto), 0644);
            // }

            $data = new Shortlink();
            $data->slug = $request->slug;
            $data->url = $request->url;
            $data->metaTitle = $request->metaTitle;
            $data->metaDesc = $request->metaDesc;
            // if($request->has("file") && $request->hasFile("file")){
                $data->file = $request->file;
            // }
            $data->save();

            return response()->json(env("APP_URL")."/redirect/".$request->slug);
        } catch (\Throwable $th) {
            return response()->json([
                "Title" => "dashboard.commonError",
                "Detail" => "ada yg salah pada aplikasi",
                "Error" => $th->getMessage()
            ],400);
        }
    }
    public function Redirect($slug){
        $data = Shortlink::where("slug",$slug)->first();

        if(empty($data)){
            return Inertia::render("NotFound",[]); 
        }
        if(empty($data->url)){
            return Inertia::render("LinkNotFound",[]); 
        }

        // if(!empty($data->file )){
        //     $data->file = env("DEPLOY","dev")=="dev"? asset("file/".$data->file):secure_asset("file/".$data->file);
        // }

        return view('redirect', ['data' => $data]);
    }
}
