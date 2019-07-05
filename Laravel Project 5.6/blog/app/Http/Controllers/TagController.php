<?php

namespace App\Http\Controllers;

use App\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function store(Request $request){
        $tag = new Tag();
        $tag->id = Str::uuid();
        $tag->name = $request->name;
        $tag->save();

        return response()->json($tag);
    }

    public function getAllTag(){
        $tags = Tag::all();
        return response()->json($tags);
    }

    public function getTagNameById(Request $request){
        $tag = Tag::where('id', $request->id)->firstOrFail();
        return response()->json($tag->name);
    }
}
