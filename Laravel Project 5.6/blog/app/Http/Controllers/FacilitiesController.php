<?php

namespace App\Http\Controllers;

use App\Facilities;
use App\Http\Requests\FacilitiesStoreRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class FacilitiesController extends Controller
{
    public function Store(FacilitiesStoreRequest $request){
        $validated = $request->validated();

        $image = $validated['icon'];
        $name = (string) Str::uuid() . '.png';
        $path = storage_path('app\public\facilities');
        $image->move($path, $name);

        $path = "facilities/" . $name;
        $storagePath = Storage::url($path);

        $facilities = new Facilities();
        $facilities->id = Str::uuid();
        $facilities->name = $validated['name'];
        $facilities->icon = $storagePath;
        $facilities->group = $validated['group'];
        $facilities->save();

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function getFacilities(){
        $facilities = Facilities::paginate();
//        $facilities = $facilities->paginate();
        return response()->json($facilities);
    }

    public function getFacilitiesByGroup(Request $request){
        $facilities = Facilities::where('group', $request->group)->get();
        return response()->json($facilities);
    }

    public function getFacilitiesById(Request $request){
        $facility = Facilities::where('id', $request->id)->get();
        return response()->json($facility);
    }

    public function updateFacilities(FacilitiesStoreRequest $request){
        $validated = $request->validated();

        $image = $validated['icon'];
        $name = (string) Str::uuid() . '.png';
        $path = storage_path('app\public\facilities');
        $image->move($path, $name);

        $path = "facilities/" . $name;
        $storagePath = Storage::url($path);

        $facility = Facilities::findOrFail($validated['id']);
        $facility->name = $validated['name'];
        $facility->icon = $storagePath;
        $facility->group = $validated['group'];
        $facility->save();

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function destroyFacilities(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        Facilities::destroy($request->id);

        return response()->json([
            'message' => 'success'
        ]);

    }

    public function countFacility(){
        $facility = Facilities::all();
        $facilityCount = $facility->count();

        return response()->json($facilityCount);
    }

    public function getFilteredFacility(Request $request){
        if($request->name){
            $facility = Facilities::where('name', 'like', '%'.$request->name.'%');
            if($request->group){
                $facility = $facility->where('group', $request->group)->paginate();

                return response()->json($facility);
            }

            return response()->json($facility->paginate());
        }
        else{
            if($request->group){
                $facility = Facilities::where('group', $request->group)->paginate();

                return response()->json($facility);
            }

            $facility = Facilities::paginate();
            return response()->json($facility);
        }
    }
}
