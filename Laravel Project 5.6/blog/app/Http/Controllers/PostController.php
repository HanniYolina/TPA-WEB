<?php

namespace App\Http\Controllers;

use App\DetailPost;
use App\Http\Requests\StorePostRequest;
use App\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function store(StorePostRequest $request){
        $validated = $request->validated();

        $uuid = Str::uuid();
        $post = new Post();
        $post->id = $uuid;
        $post->title = $validated['title'];
        $post->content = $validated['content'];
        $post->picture_name = $validated['picture_name'];
        $post->role = $validated['role'];
        $post->tags = $validated['tags'];
        $post->save();

        return response()->json([
            'status' => 'success',
            'id' => $uuid
        ]);
    }

    public function uploadImage(Request $request){
        $validate = Validator::make($request->all(),[
            'picture_name' => 'required',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }
        $image = $request->picture_name;
        $extension =  $image->clientExtension();
        $name = (string) Str::uuid() . "." . $extension;
        $path = storage_path('app\public\post');
        $image->move($path, $name);

        $path = "post/" . $name;
        $storagePath = Storage::url($path);

        return $storagePath;
    }

    public function getAllPost(){
        $posts = Post::paginate();
        return response()->json($posts);
    }


    public function getFilteredPost(Request $request){
        if($request->role){
            $post = Post::where('role', $request->role);

            if($request->title){
                $post = $post->where('title', 'like', '%'.$request->title.'%');

                if($request->tags){

                    $detail = DetailPost::where('tag_id', $request->tags)->get(['post_id']);


                    $post = $post->whereIn('id', $detail)->paginate();

                    return response()->json($post);
                }

                return response()->json($post->paginate());
            }
            else{
                if($request->tags){
                    $detail = DetailPost::where('tag_id', $request->tags)->get(['post_id']);

                    $post = $post->whereIn('id', $detail)->paginate();

                    return response()->json($post);
                }

                return response()->json($post->paginate());
            }
        }
        else{
            if($request->title){
                $post = Post::where('title', 'like', '%'.$request->title.'%');

                if($request->tags){
                    $detail = DetailPost::where('tag_id', $request->tags)->get(['post_id']);

                    $post = $post->whereIn('id', $detail)->paginate();

                    return response()->json($post);

                }

                return response()->json($post->paginate());
            }
            else{
                if($request->tags){

                    $detail = DetailPost::where('tag_id', $request->tags)->get(['post_id']);

                    $post = Post::whereIn('id', $detail)->paginate();

                    return response()->json($post);
                }
            }
        }

        return null;
    }

    public function getPostById(Request $request){
        $post = Post::where('id', $request->id)->first();
        return response()->json($post);
    }

    public function deletePost(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|strikosng',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        Post::destroy($request->id);

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function updatePost(StorePostRequest $request){
        $validated = $request->validated();

        $post = Post::where('id', $validated['id'])->first();
        $post->title = $validated['title'];
        $post->content = $validated['content'];
        $post->role = $validated['role'];
        $post->tags = $validated['tags'];

        if($validated['picture_name'] != "null" && $validated['picture_name'] != $post->picture_name){
            $image = $validated['picture_name'];
            $extension =  $image->clientExtension();
            $name = (string) Str::uuid() . "." . $extension;
            $path = storage_path('app\public\post');
            $image->move($path, $name);

            $path = "post/" . $name;
            $storagePath = Storage::url($path);
            $properties['picture_name'] = $storagePath;
        }

        $post->save();

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function countPost(){
        $post = Post::all();
        $postCount = $post->count();

        return response()->json($postCount);
    }

    public function getAllRecommendedPost(Request $request){
        $post = Post::where('id', '!=', $request->id)->orderby('updated_at')->get();

        return response()->json($post);
    }
}
