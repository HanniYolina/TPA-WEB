<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewStoreRequest;
use App\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    public function store(ReviewStoreRequest $request){
        $review = new Review();

        $review->id = Str::uuid();
        $review->contents = $request->contents;
        $review->properties_id = $request->properties_id;
        $review->parent_id = $request->parent_id;
        $review->children_id = $request->children_id;
        $review->user_id = $request->user_id;
        $review->average_star = $request->average_star;
        $review->stars = $request->stars;
        $review->save();

        return response()->json($review);
    }

    public function getAllReview(Request $request){
        $review = Review::where('properties_id', $request->properties_id)->where('parent_id', $request->parent_id);
        if($request->type == null){
            return $review->paginate();
        }else{
            return $review->get();
        }
    }
}
