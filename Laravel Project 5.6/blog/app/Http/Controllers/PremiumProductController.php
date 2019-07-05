<?php

namespace App\Http\Controllers;

use App\Http\Requests\PremiumStoreRequest;
use App\PremiumProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PremiumProductController extends Controller
{
    public function store(PremiumStoreRequest $request){
        $validated = $request->validated();

        $premium = new PremiumProduct();
        $premium->id = (string) Str::uuid();
        $premium->price = $validated['price'];
        $premium->promo = $validated['promo'];
        $premium->duration = $validated['duration'];
        $premium->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function getAllPremium(){
        $premium = PremiumProduct::paginate();

        return response()->json($premium);
    }

    public function destroyPremium(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }
        PremiumProduct::destroy($request->id);

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function getPremiumById(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $premium = PremiumProduct::where('id', $request->id)->first();

        return response()->json($premium);
    }

    public function updatePremium(PremiumStoreRequest $request){
        $validated = $request->validated();

        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $premium = PremiumProduct::where('id', $request->id)->first();

        $premium->price = $validated['price'];
        $premium->duration = $validated['duration'];
        $premium->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function addPromo(Request $request){
        $validate = Validator::make($request->all(),[
            'id' => 'required|string',
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $premium = PremiumProduct::where('id', $request->id)->first();

        $premium->promo = $request->promo;
        $premium->save();

        return response()->json([
            'status' => 'success'
        ]);
    }

    public function countPremium(){
        $premium = PremiumProduct::all();
        $premiumCount = $premium->count();

        return response()->json($premiumCount);
    }

//    public function getFilteredPremium(Request $request){
//        $premium = DB::table('premium_products')->where('duration->month', '=', 0)->get();
//
//        return $premium;
//    }


}
