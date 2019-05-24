<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class verify_phone extends Model
{
    //
    protected $keyType = 'string';
    protected $fillable = [
        'user_id', 'phone'
    ];

    protected $hidden = [
        'token'
    ];
}
