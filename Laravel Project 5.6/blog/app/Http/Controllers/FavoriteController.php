<?php

namespace App\Http\Controllers;

use App\Favorite;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FavoriteController extends Controller
{
    public function favorite(Request $request){
        $favorite = Favorite::where('user_id', $request->user_id)->where('properties_id', $request->properties_id)->first();

        if($favorite){
            //unfavorite
            Favorite::destroy($favorite->id);
            return response()->json([
                'type' => 'Favorite'
            ]);
        }else{
            //favorite
            $favorite = new Favorite();
            $favorite->id = Str::uuid();
            $favorite->user_id = $request->user_id;
            $favorite->properties_id = $request->properties_id;
            $favorite->favorite_at = Carbon::now();
            $favorite->save();
            return response()->json([
                'type' => 'Unfavorite'
            ]);
        }
    }

    public function getFavorite(Request $request){
        $favorite = Favorite::where('user_id', $request->user_id)->where('properties_id', $request->properties_id)->first();
        if($favorite){
            return response()->json([
                'type' => 'Unfavorite'
            ]);
        }
        else{
            return response()->json([
                'type' => 'Favorite'
            ]);
        }
    }

    public function getAllFavoriteByUser(Request $request){
        $favorite = Favorite::where('user_id', $request->user_id)->paginate();
        return response()->json($favorite);
    }

    public function countFavorite(Request $request){
        $count = Favorite::where('properties_id', $request->properties_id)->count();

        return $count;
    }

}
