<?php

namespace App\Http\Controllers;

use App\Apartment;
use App\Http\Requests\ApartmentStoreRequest;
use App\Http\Requests\RoomStoreRequest;
use App\Properties;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ApartmentController extends Controller
{
    public function addApartment(ApartmentStoreRequest $request){
        $validated = $request->validated();

        $apartment = new Apartment();

        $apartment->id = Str::uuid();

        $properties = new Properties();

        $properties->propertiesable_id = $apartment->id;

        $uuid = Str::uuid();
        $properties->id = $uuid;
        $properties->owner_id = $validated['owner_id'];

        $apartment->unit_type = $validated['unit_type'];
        $apartment->unit_condition = $validated['unit_condition'];
        $apartment->unit_floor = $validated['unit_floor'];

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

        $properties->public_facilities = $validated['public_facilities'];
        $properties->additional_info = $validated['additional_info'];
        $properties->additional_fee = $validated['additional_fee'];
        $properties->latitude = $validated['latitude'];
        $properties->longitude = $validated['longitude'];
        $properties->status = 1;
        $apartment->Properties()->save($properties);

        $apartment->save();

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

    public function getAllApartmentByOwnerId(Request $request){
        $validate = Validator::make($request->all(),[
            'owner_id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $room = Properties::where('owner_id', $request->owner_id)->where('propertiesable_type', 'App\Apartment')->paginate();
        return response()->json($room);
    }
}
