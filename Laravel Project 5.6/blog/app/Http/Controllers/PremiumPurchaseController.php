<?php

namespace App\Http\Controllers;

use App\PremiumPurchase;
use Barryvdh\DomPDF\PDF;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PremiumPurchaseController extends Controller
{
    public function orderPremium(Request $request){
        //add new premmium purchase
        $purchase = new PremiumPurchase();
        $purchase->id = (string) Str::uuid();
        $purchase->invoice = (string) Str::uuid();
        $purchase->user_id = $request->user_id;
        $purchase->duration = $request->duration;
        $purchase->price = $request->price;

        $date = Carbon::now();
        $date = $date->addDays(1);

        $purchase->due_date = $date;

        $purchase->save();
        return response()->json($purchase);
    }

    public function payPremium(Request $request){
        $purchase = PremiumPurchase::where('id', $request->id)->first();
        $purchase->paid_at = Carbon::now();
        $purchase->save();
        return response()->json($purchase);
    }

    public function getAllTransaction(){
        $transaction = PremiumPurchase::paginate();
        return response()->json($transaction);
    }

    public function getCompletedTransaction(){
        $transaction = PremiumPurchase::where('paid_at','!=',null)->paginate();
        return response()->json($transaction);
    }

    public function countTransaction(){
        $transaction = PremiumPurchase::all();
        $transactionCount = $transaction->count();

        return response()->json($transactionCount);
    }
}

