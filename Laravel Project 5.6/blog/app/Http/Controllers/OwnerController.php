<?php

namespace App\Http\Controllers;

use App\Http\Requests\OwnerLoginRequest;
use App\Http\Requests\OwnerRegisterRequest;
use App\User;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class OwnerController extends UserController
{
    use ThrottlesLogins;
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(OwnerRegisterRequest $request)
    {
        $validated = $request->validated();

        $user = new User();
        $user->id = Str::uuid();
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'];
        $user->password = Hash::make($validated['password']);
        $user->status = $validated['status'];
        $user->type = $validated['type'];
        $user->save();

        return response()->json([
            'message' => 'Success'
        ]);
    }

    public function login(OwnerLoginRequest $request){
        $validated = $request->validated();

        $credentials['phone'] = $validated['phone'];
        $credentials['password'] = $validated['password'];

        if($this->hasTooManyLoginAttempts($request)){
            return $this->sendLockoutResponse($request);
        }
        else{
            $this->fireLockoutEvent($request);
        }

        if($request->rememberme){
            JWTAuth::factory()->setTTL(60*24*7);
        }

        try {
            if (! $token = JWTAuth::attempt($credentials, ['exp' => Carbon::now()->addHour(6)->timestamp])) {
                $this->incrementLoginAttempts($request);
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

        return response()->json([
            'message' => 'success',
            'data'=> [
                'token' => $token
            ]
        ]);

    }

    protected function hasTooManyLoginAttempts(Request $request)
    {
        return $this->limiter()->tooManyAttempts(
            $this->throttleKey($request), 5, 1 // <--- Change this
        );
    }

    public function throttleKey(Request $request)
    {
        return Str::lower($request->input($this->username())).$request->ip();
    }

    public function username(){
        return 'phone';
    }
}
