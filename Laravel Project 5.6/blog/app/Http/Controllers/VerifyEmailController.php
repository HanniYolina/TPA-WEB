<?php

namespace App\Http\Controllers;

use App\Mail\SendMailable;
use App\User;
use App\verify_email;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;

class VerifyEmailController extends Controller
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
            'email' => 'required|string|email'
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();

        $verify_email = new verify_email();
        $verify_email->id = Str::uuid();
        $verify_email->email = $request->email;
        $verify_email->user_id = $user->id;
        $verify_email->token = Str::uuid();
        $verify_email->save();

//        dd($verify_email->token);
        $this->mail($request, $verify_email->token, $verify_email->email);

    }

    public function mail(Request $request, $token, $email){
//        dd($email);

        Mail::to($request->email)->send(new SendMailable($token, $email, null));

//        dd($request->header('Authorization'));
//        $user = JWTAuth::parseToken()->authenticate();
//        dd($user);
//        Mail::send('emailVerification', ['user' => $user], function ($message) use ($request) {
//            $message->to($request->email)
//                ->subject('Verification Email')
//                ->getHeaders()
//                ->addTextHeader('Authorization', $request->header('Authorization'));
////            dd($message);
//        });

        return \response()->json([
            'status' => 'success'
        ]);
    }

    public function verifyEmail(Request $request){
//        dd($request->token);

        $verify_email = DB::table('verify_emails')->where('token', $request->token)->where('email', $request->email)->first();

//        dd($verify_email);
        DB::table('users')->where('id', $verify_email->user_id)->update(['email_verified_at' => Carbon::now()]);
//        dd($user);
        $this->destroy($verify_email->token, $verify_email->email);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\verify_email  $verify_email
     * @return \Illuminate\Http\Response
     */
    public function destroy($token , $email)
    {
        DB::table('verify_emails')->where('email', $email)->where('token',$token)->delete();

        return response()->json([
            'status' => 'success'
        ]);
    }
}
