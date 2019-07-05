<?php

namespace App\Http\Controllers;

use App\Facilities;
use App\Http\Requests\ApartmentStoreRequest;
use App\Http\Requests\RoomStoreRequest;
use App\Properties;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PropertiesController extends Controller
{
    public function getRoom(){
        $kost = Properties::where('propertiesable_type', 'App\Kost')->where('status', 1)->get();
        $apartment = Properties::where('propertiesable_type', 'App\Apartment')->where('status', 1)->get();
        return response()->json([
            'kost' => $kost,
            'apartment' => $apartment
        ]);
    }

    public function destroyRoom(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }
        Properties::destroy($request->id);

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function getRoomById(Request $request){
        $room = Properties::where('id', $request->id)->first();
        $kost = $room->propertiesable;

        return response()->json([
            'room' => $room,
            'kost' => $kost
        ]);
    }

    public function updateRoom(RoomStoreRequest $request){
        $validated = $request->validated();

        $properties = Properties::where('id', $request->id)->first();

        $properties->propertiesable->room_left = $validated['room_left'];
        $properties->propertiesable->parking_facilities = $validated['parking_facilities'];
        $properties->propertiesable->gender_type = $validated['gender_type'];

        $properties->propertiesable->save();

        $properties->owner_id = $validated['owner_id'];

        $properties->name = $validated['name'];
        $properties->description = $validated['description'];
        $properties->price = $validated['price'];
        $properties->city = $validated['city'];

        //picture_name
        if($validated['picture_name'] != "null" && $validated['picture_name'] != $properties->picture_name){
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
        if( $validated['banner_name'] != "null" && $validated['banner_name'] != $properties->banner_name){
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
        if($validated['video_name'] != "null" && $validated['video_name'] != $properties->video_name){
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
        if($validated['picture360_name'] != "null" && $validated['picture360_name'] != $properties->picture360_name){
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
        $properties->address = $validated['address'];
        $properties->latitude = $validated['latitude'];
        $properties->longitude = $validated['longitude'];

        $properties->save();

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function updateApartment(ApartmentStoreRequest $request){
        $validated = $request->validated();

        $properties = Properties::where('id', $request->id)->first();

        $properties->propertiesable->unit_type = $validated['unit_type'];
        $properties->propertiesable->unit_condition = $validated['unit_condition'];
        $properties->propertiesable->unit_floor = $validated['unit_floor'];
        $properties->propertiesable->save();

        $properties->owner_id = $validated['owner_id'];

        $properties->name = $validated['name'];
        $properties->description = $validated['description'];
        $properties->price = $validated['price'];
        $properties->city = $validated['city'];

        //picture_name
        if($validated['picture_name'] != "null" && $validated['picture_name'] != $properties->picture_name){
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
        if( $validated['banner_name'] != "null" && $validated['banner_name'] != $properties->banner_name){
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
        if($validated['video_name'] != "null" && $validated['video_name'] != $properties->video_name){
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
        if($validated['picture360_name'] != "null" && $validated['picture360_name'] != $properties->picture360_name){
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
        $properties->address = $validated['address'];
        $properties->latitude = $validated['latitude'];
        $properties->longitude = $validated['longitude'];

        $properties->save();

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function countProperties(Request $request){
        $kost = Properties::where('propertiesable_type', 'App\Kost')->where('owner_id', $request->owner_id)->where('status', 1)->get();
        $apartment = Properties::where('propertiesable_type', 'App\Apartment')->where('owner_id', $request->owner_id)->where('status', 1)->get();

        $countKost = $kost->count();
        $countApartment = $apartment->count();

        return response()->json([
           'countKost' => $countKost,
           'countApartment' => $countApartment
        ]);
    }

    public function banProperties(Request $request){
        $properties = Properties::where('id', $request->id)->first();
        $properties->status = 2;
        $properties->save();
        return response()->json([
            'message' => 'success'
        ]);
    }

    public function search(Request $request){
        $keyword = $request->keyword;
        $redis = Redis::connection();

        $range = $redis->lrange($keyword, 0, 4);

        if($range!=null){
            $arr = [];
            foreach ($range as $r){
                array_push($arr,json_decode($r));
            }

            return response()->json($arr);
        }

        $properties = Properties::where('name', 'like', '%'.$keyword.'%')->get();

        return response()->json($properties);
    }

    public function getNearestKost(Request $request){
        $latitude = $request->latitude;
        $longitude = $request->longitude;

        $kost = Properties::where('propertiesable_type', 'App\Kost');
        if($request->name != null){
            $kost = $kost->where('name', 'like', '%'.$request->name.'%');
        }

        $kost = $kost->select(DB::raw('*, ( 6367 * acos( cos( radians('.$latitude.') ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians('.$longitude.') ) + sin( radians('.$latitude.') ) * sin( radians( latitude ) ) ) ) AS distance'))
            ->having('distance', '<', 1 )
            ->orderBy('distance');

        if($request->type == "get"){
            $kost = $kost->where('id', '!=', $request->id)->get();
        }
        else{
            $kost = $kost->simplePaginate();
        }

        return response()->json($kost);
    }

    public function getNearestApartment(Request $request){
        $latitude = $request->latitude;
        $longitude = $request->longitude;

        $apartment = Properties::where('propertiesable_type', 'App\Apartment');
        if($request->name != null){
            $apartment = $apartment->where('name', 'like', '%'.$request->name.'%');
        }

        $apartment = $apartment->select(DB::raw('*, ( 6367 * acos( cos( radians('.$latitude.') ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians('.$longitude.') ) + sin( radians('.$latitude.') ) * sin( radians( latitude ) ) ) ) AS distance'))
            ->having('distance', '<', 1)
            ->orderBy('distance');

        if($request->type == "get"){
            $apartment = $apartment->where('id', '!=', $request->id)->get();
        }
        else{
            $apartment = $apartment->simplePaginate();
        }

        return response()->json($apartment);
    }

    public function getRadius(Request $request){
        $latitude = $request->latitude;
        $longitude = $request->longitude;

        $properties = Properties::select(DB::raw('*, ( 6367 * acos( cos( radians('.$latitude.') ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians('.$longitude.') ) + sin( radians('.$latitude.') ) * sin( radians( latitude ) ) ) ) AS distance'))
            ->having('distance', '<',  1)->get()->count();

        return $properties;
    }
}
