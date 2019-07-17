<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\UserFollower;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserFollowerController extends Controller
{
    public function store(Request $request){
        $userId = User::where('id', $request->user_id)->first();
        $follower = User::where('id', $request->follower_id)->first();

        if($follower && $follower->type=='1'){
//            kalo followernya itu guest
            if($userId && $userId->type=='2'){
//                kalo yang di follow itu owner
                $user_follower = new UserFollower();
                $user_follower->id = Str::uuid();
                $user_follower->user_id = $userId->id;
                $user_follower->follower_id = $follower->id;
                $user_follower->save();

                return response()->json([
                    'status' => 'success'
                ]);
            }
        }
        return response()->json([
            'status' => 'failed'
        ]);
    }

    public function getUserFollow(Request $request){
        $id = UserFollower::where('user_id', $request->user_id)->where('follower_id', $request->follower_id)->first();

        if($id){
            return response()->json([
                'userFollower' => $id,
                'message' => 'success'
            ]);
        }
        else{
            return response()->json([
                'message' => 'failed'
            ]);
        }
    }

    public function destroyFollow(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        UserFollower::destroy($request->id);

        return response()->json([
            'message' => 'success'
        ]);

    }

    public function getAllFollowing(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $allFollow = UserFollower::where('follower_id', $request->id)->paginate();

        return response()->json(($allFollow));
    }

    public function getAllFollower(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $allFollow = UserFollower::where('user_id', $request->id)->get();

        return response()->json(($allFollow));
    }

    public function countFollower(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $allFollow = UserFollower::where('user_id', $request->id)->get()->count();

        return response()->json(($allFollow));
    }

    public function countFollowing(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $allFollow = UserFollower::where('follower_id', $request->id)->get()->count();

        return response()->json(($allFollow));
    }
}
