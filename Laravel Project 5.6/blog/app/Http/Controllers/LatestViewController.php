<?php

namespace App\Http\Controllers;

use App\LatestView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LatestViewController extends Controller
{
    public function store(Request $request){
        $latestView = LatestView::where('user_id', $request->user_id)->where('properties_id', $request->properties_id)->first();

        if($latestView){
            $latestView->viewed_at = Carbon::now();
            $latestView->save();
        }
        else{
            $latestView = new LatestView();
            $latestView->id = Str::uuid();

            $latestView->user_ip = $_SERVER['REMOTE_ADDR'];
            $latestView->user_id = $request->user_id;
            $latestView->properties_id = $request->properties_id;
            $latestView->viewed_at = Carbon::now();
            $latestView->save();
        }
    }

    public function getLatestView(Request $request){
        $latestView = LatestView::where('user_id',$request->user_id)->orderBy('viewed_at', 'asc')->get();
        return response()->json($latestView);
    }
}
