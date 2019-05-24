<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class verify_email extends Model
{
    protected $keyType = 'string';
    protected $fillable = [
        'user_id', 'email'
    ];

    protected $hidden = [
        'token'
    ];
}
