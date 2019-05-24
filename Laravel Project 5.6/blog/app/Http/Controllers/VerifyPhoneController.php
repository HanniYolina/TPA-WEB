<?php

namespace App\Http\Controllers;

use App\Mail\SendMailable;
use App\verify_email;
use App\verify_phone;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class VerifyPhoneController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validate = Validator::make($request->all(),[
            'phone' => 'required|string|min:10'
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();

        $verify_phone = new verify_phone();
        $verify_phone->id = Str::uuid();
        $verify_phone->phone = $request->phone;
        $verify_phone->user_id = $user->id;
        $verify_phone->token = Str::uuid();
        $verify_phone->save();

        $this->mail($verify_phone->token, $user->email, $verify_phone->phone);

    }

    public function mail($token, $email, $phone){
        Mail::to($email)->send(new SendMailable($token, null, $phone));

        return \response()->json([
            'status' => 'success'
        ]);
    }

    public function verifyPhone(Request $request){
        $verify_phone = DB::table('verify_phones')->where('token', $request->token)->where('phone', $request->phone)->first();
        DB::table('users')->where('id', $verify_phone->user_id)->update(['phone_verified_at' => Carbon::now()]);
        $this->destroy($verify_phone->token, $verify_phone->phone);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\verify_email  $verify_email
     * @return \Illuminate\Http\Response
     */
    public function destroy($token , $phone)
    {
        DB::table('verify_phones')->where('phone', $phone)->where('token',$token)->delete();

        return response()->json([
            'status' => 'success'
        ]);
    }
}
