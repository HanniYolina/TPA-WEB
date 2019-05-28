<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function getLoggedUser(){
        //get user
        $user = JWTAuth::parseToken()->authenticate();
        $path = "images/" . $user->picture_name;
        $storagePage = Storage::url($path);

        return response()->json(['user' => $user, 'path' => $storagePage] );
    }

    public function logout(Request $request)
    {
        $token = $request->header('Authorization');
        try {
            JWTAuth::invalidate($token);
            return response()->json([
                'status' => 'success',
                'message'=> "User successfully logged out."
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to logout, please try again.'
            ], 500);
        }
    }

    public function uploadPP(Request $request){
        $image = $request->file('image');

        $validate = Validator::make($request->all(),[
            'image' => 'mimes:jpeg,jpg,png|required|max:10000'
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $name = (string) Str::uuid() . '.png';
        $path = storage_path('app\public\images');
        $image->move($path, $name);

        $user = JWTAuth::parseToken()->authenticate();
        $user->picture_name = $name;
        $user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function uploadProfile(Request $request){
        $validate = Validator::make($request->all(),[
            'city' => 'string|required'
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $user->city = $request->city;
        $user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function updateUsername(Request $request){
        $validate = Validator::make($request->all(),[
            'username' => 'required|unique:users,username'
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $user->username = $request->username;
        $user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function getUserById(Request $request){
        $user = User::where('id', $request->id)->first();
        $path = "images/" . $user->picture_name;
        $storagePage = Storage::url($path);

        return response()->json(['user' => $user, 'path' => $storagePage] );
    }

    public function changePassword(Request $request){
        $validate = Validator::make($request->all(),[
            'password' => 'required',
            'newPassword' => 'required|string|min:8|confirmed',
            'type' => 'required'
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $credentials = "";
        if($request->type == 1){
            //guest
            $credentials = $request->only('email', 'password', 'type');
        }
        elseif ($request->type == 2){
            //owner
            $credentials = $request->only('phone', 'password', 'type');
        }


        try {
            if (! $token = JWTAuth::attempt($credentials, ['exp' => Carbon::now()->addHour(6)->timestamp])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'We can`t find an account with this credentials.'
                ]);
            }
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to login, please try again.'
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function getGuestOrOwner(Request $request){
        $user = User::where('type', $request->type)->get();

        return response()->json($user);
    }

    public function banUser(Request $request){
        //status 2 banned
        $user = User::where('id', $request->id)->first();
        $user->status = 2;
        $user->save();

        return response()->json([
            'message' => 'success'
        ]);

    }
}
