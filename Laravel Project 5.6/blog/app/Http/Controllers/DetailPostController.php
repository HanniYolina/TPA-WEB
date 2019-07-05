<?php

namespace App\Http\Controllers;

use App\DetailPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DetailPostController extends Controller
{
    public function store(Request $request){
        $detailPost = new DetailPost();
        $detailPost->id = Str::uuid();
        $detailPost->post_id = $request->post_id;
        $detailPost->tag_id = $request->tag_id;
        $detailPost->save();

        return response()->json([
            'status' => 'success'
        ]);
    }
}
