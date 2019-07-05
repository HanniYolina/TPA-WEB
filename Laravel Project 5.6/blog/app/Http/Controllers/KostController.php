<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomStoreRequest;
use App\Kost;
use App\Properties;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class KostController extends Controller
{
    public function addRoom(RoomStoreRequest $request){
        $validated = $request->validated();

        $kost = new Kost();

        $kost->id = Str::uuid();
        $kost->room_left = $validated['room_left'];
        $kost->parking_facilities = $validated['parking_facilities'];
        $kost->gender_type = $validated['gender_type'];

        $properties = new Properties();

        $properties->propertiesable_id = $kost->id;

        $uuid = Str::uuid();
        $properties->id = $uuid;
        $properties->owner_id = $validated['owner_id'];

        $properties->name = $validated['name'];
        $properties->description = $validated['description'];
        $properties->price = $validated['price'];
        $properties->city = $validated['city'];

        //picture_name
        if($validated['picture_name'] != ""){
            $image = $validated['picture_name'];
            $extension =  $image->clientExtension();
            $name = (string) Str::uuid() . "." . $extension;
            $path = storage_path('app\public\picture_name');
            $image->move($path, $name);

            $path = "picture_name/" . $name;
            $storagePath = Storage::url($path);
            $properties['picture_name'] = $storagePath;
        }

        $properties->room_facilities = $validated['room_facilities'];
        $properties->room_area = $validated['room_area'];

        //banner_name
        if($validated['banner_name'] != ""){
            $image = $validated['banner_name'];
            $extension =  $image->clientExtension();
            $name = (string) Str::uuid() . "." . $extension;
            $path = storage_path('app\public\banner_name');
            $image->move($path, $name);

            $path = "banner_name/" . $name;
            $storagePath = Storage::url($path);
            $properties['banner_name'] = $storagePath;
        }

        //video_name
        if($validated['video_name'] != ""){
            $image = $validated['video_name'];
            $extension =  $image->clientExtension();
            $name = (string) Str::uuid() . "." . $extension;
            $path = storage_path('app\public\video_name');
            $image->move($path, $name);

            $path = "video_name/" . $name;
            $storagePath = Storage::url($path);
            $properties['video_name'] = $storagePath;
        }

        //picture360_name
        if($validated['picture360_name'] != ""){
            $image = $validated['picture360_name'];

            $extension =  $image->clientExtension();
            $name = (string) Str::uuid() . "." . $extension;
            $path = storage_path('app\public\picture360_name');
            $image->move($path, $name);

            $path = "picture360_name/" . $name;
            $storagePath = Storage::url($path);
            $properties['picture360_name'] = $storagePath;
        }

//        $properties->banner_name = $request->banner_name;
//        $properties->video_name = $request->video_name;
//        $properties->picture360_name = $request->picture360_name;

        $properties->public_facilities = $validated['public_facilities'];
        $properties->additional_info = $validated['additional_info'];
        $properties->additional_fee = $validated['additional_fee'];
        $properties->latitude = $validated['latitude'];
        $properties->longitude = $validated['longitude'];
        $properties->status = 1;

        $kost->Properties()->save($properties);

        $kost->save();

        //redis
        $redis = Redis::connection();
        $name = explode(' ', $validated['name']);

        $json = [
            'id' => $uuid,
            'name' => $validated['name']
        ];

        $json_en = json_encode($json);

        foreach ($name as $key){
            $redis->lpush($key, $json_en);
        }
        return response()->json([
            'status' => 'success'
        ]);
    }

    public function getAllRoomByOwnerId(Request $request){
        $validate = Validator::make($request->all(),[
            'owner_id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $room = Properties::where('owner_id', $request->owner_id)->where('propertiesable_type', 'App\Kost')->paginate();
        return response()->json($room);
    }

}
