<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redis;
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
            JWTAuth::parseToken($token)->invalidate();
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
        $user = User::where('type', $request->type)->paginate();

        return response()->json($user);
    }

    public function getFilteredUser(Request $request){
        $user = User::where('type', $request->type);
        if($request->activeStatus) {
            $user = $user->where('status', 1);

            if($request->emailVerified){
                $user = $user->where('email_verified_at', '!=', null)->paginate();
                return response()->json($user);
            }
            return response()->json($user->paginate());
        }
        else{
            if($request->emailVerified){
                $user = $user->where('email_verified_at', '!=', null)->paginate();
                return response()->json($user);
            }
            return response()->json($user->paginate());
        }
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

    public function resetPassword(Request $request){
        $user = User::where('id', $request->id)->first();
        $newPassword = substr(md5(time()), 0, 8);

        $user->password = Hash::make($newPassword);
        $user->save();

        $data = array(
            'newPassword' => $newPassword,
        );

        $destination = $user->email;

        Mail::send('resetPassword', $data, function($message) use ($destination, $data){
            $message->to($destination)->subject('Reset Password');
            $message->from('familyof18.2@gmail.com', 'No-Reply');
        });

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function sendChat(Request $request){
        $to_id = $request->to_id;
        $from_id = $request->from_id;
        $contents = $request->contents;

        $redis = Redis::connection();
        $chat_room_id = $redis->get($to_id.$from_id)? $redis->get($to_id.$from_id) : $redis->get($from_id.$to_id);
        if($chat_room_id == null){
            $chat_room_id = (int) $redis->get('chat_room_id') + 1;
            $redis->set('chat_room_id', $chat_room_id);
            $redis->set($to_id.$from_id, $chat_room_id);
        }

        $redis->lrem('chat.with:'.$to_id, 0, $from_id);
        $redis->lpush('chat.with:'.$to_id, $from_id);

        $redis->lrem('chat.with:'.$from_id, 0, $to_id);
        $redis->lpush('chat.with:'.$from_id, $to_id);

        $newId = sizeof($redis->zrangebyscore('chat.room:'.$chat_room_id,'-inf','+inf'))+1;
        $redis->hmset('chat.'.$chat_room_id.':'.$newId, 'chat_id', $newId, 'to_id', $to_id, 'from_id', $from_id, 'contents', $contents);
        $redis->zadd('chat.room:'.$chat_room_id, $newId, $newId);

        return "success";

    }

    public function getAllChat(Request $request){
        $to_id = $request->to_id;
        $from_id = $request->from_id;

        $redis = Redis::connection();
        $chat_room_id = $redis->get($to_id.$from_id)? $redis->get($to_id.$from_id) : $redis->get($from_id.$to_id);
        if($chat_room_id == null){
            $chat_room_id = (int) $redis->get('chat_room_id') + 1;
            $redis->set('chat_room_id', $chat_room_id);
            $redis->set($to_id.$from_id, $chat_room_id);
        }
        $lastId = sizeof($redis->zrangebyscore('chat.room:'.$chat_room_id,'-inf','+inf'));
        $arr = $redis->zrangebyscore('chat.room:'.$chat_room_id, 0 , $lastId);

        $redis->set($to_id.':'.$chat_room_id,$lastId);

        $read = $redis->get($from_id.':'.$chat_room_id)? $redis->get($from_id.':'.$chat_room_id):0;

        $arrItem = [];
        for($i=0; $i<sizeof($arr); $i++){
            if($redis->hgetall('chat.'.$chat_room_id.':'.$arr[$i])!=null){
                array_push($arrItem, $redis->hgetall('chat.'.$chat_room_id.':'.$arr[$i]));
            }
        }

        return response()->json([
            'chat' => $arrItem
        ]);
    }

    public function getChatList(Request $request){
        $id = $request->id;
        $redis = Redis::connection();
        $arr = $redis->lrange('chat.with:'.$id, 0, -1);

        $arrJson = [];
        for($i=0; $i<sizeof($arr); $i++){
            $chat_room_id = $redis->get($id.$arr[$i]) ? $redis->get($id.$arr[$i]) : $redis->get($arr[$i].$id);
            $new_id = sizeof($redis->zrangebyscore('chat.room:'.$chat_room_id, '-inf','+inf'));
            $last_id = $redis->zrangebyscore('chat.room:'.$chat_room_id, $new_id, $new_id)[0];
            $message = $redis->hgetall('chat.'.$chat_room_id.':'.$last_id);

            $data = [
                'id' => $arr[$i],
                'last_chat' => $message,
                'user' => User::where('id', $arr[$i])->first()
            ];

            array_push($arrJson, $data);
        }

        return $arrJson;
    }

    public function test(Request $request){
        $keyword = $request->keyword;

        $redis = Redis::connection();
        return $redis->get($keyword);
    }

    public function countUser(){
        $guest = User::where('type', 1)->get();
        $guestCount = $guest->count();

        $owner = User::where('type', 2)->get();
        $ownerCount = $owner->count();

        $admin = User::where('type', 3)->get();
        $adminCount = $admin->count();

        return response()->json([
            'guestCount' => $guestCount,
            'ownerCount' => $ownerCount,
            'adminCount' => $adminCount
        ]);
    }

    public function loginNotif(Request $request){
        if($request->email){
            $destination = $request->email;
        }
        else if($request->phone){
            $user = User::where('phone', $request->phone)->first();
            $destination = $user->email;
        }

        $data = array(
            'email' => $destination,
        );

        Mail::send('loginNotif', $data, function($message) use ($destination, $data){
            $message->to($destination)->subject('Login Notification');
            $message->from('familyof18.2@gmail.com', 'No-Reply');
        });
    }

}
