<?php

namespace App\Http\Controllers;

use App\PremiumOwner;
use App\User;
use Barryvdh\DomPDF\Facade as PDF;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PremiumOwnerController extends Controller
{

    public function addPremiumOwner(Request $request){
        $premiumOwner = new PremiumOwner();
        $premiumOwner->id = Str::uuid();
        $premiumOwner->user_id = $request->user_id;
        $premiumOwner->start_date = Carbon::now();

        $duration = json_decode($request->transaction['duration']);
        if($duration->day != 0){
            $date = Carbon::now();
            $date = $date->addDays($duration->day);
            $premiumOwner->end_date = $date;
        }
        else if($duration->month !=0){
            $date = Carbon::now();
            $date = $date->addMonths($duration->month);
            $premiumOwner->end_date = $date;
        }
        else if($duration->year !=0){
            $date = Carbon::now();
            $date = $date->addYears($duration->year);
            $premiumOwner->end_date = $date;
        }
        else if($duration->week !=0){
            $date = Carbon::now();
            $date = $date->addWeeks($duration->week);
            $premiumOwner->end_date = $date;
        }

        $premiumOwner->premiumPurchase_id = $request->transaction['id'];
        $premiumOwner->save();
        return response()->json($premiumOwner);
    }

    public function getPremiumOwnerById(Request $request){
        $premiumOwner = PremiumOwner::where('user_id', $request->id)->first();
        if(empty($premiumOwner)) return null;

        return response()->json($premiumOwner);
    }

    public function sendPDF(Request $request){
        $premiumOwner = $request->premiumOwner;

        $start_date = $premiumOwner['start_date'];
        $start_date = $start_date['date'];

        $end_date = $premiumOwner['end_date'];
        $end_date = $end_date['date'];

        $owner = User::where('id', $premiumOwner['user_id'])->first();

        $data = array(
            'invoice' => $premiumOwner['premiumPurchase_id'],
            'start_date' => $start_date,
            'end_date' => $end_date,
            'name' => $owner->name,
            'price' => $request->price,
        );

        $destination = $owner->email;
        Mail::send('pdf', $data, function($message) use ($destination, $data){
            $pdf = PDF::loadView('pdf',$data);
            $message->to($destination)->subject('Payment Invoice');
            $message->from('familyof18.2@gmail.com', 'No-Reply');
            $message->attachData($pdf->output(), 'Invoice.pdf', ['mime' => 'application/pdf']);
        });
    }

    public function getAllPremiumByUserId(Request $request){
        $premium = PremiumOwner::where('user_id',$request->id)->paginate();
        return response()->json($premium);
    }

    public function getPremiumOwnerByItsId(Request $request){
        $premium = PremiumOwner::where('id', $request->id)->first();
        return $premium;
    }
}
