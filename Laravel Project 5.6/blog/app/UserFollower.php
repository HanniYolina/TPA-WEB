<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserFollower extends Model
{
    protected $keyType = 'string';
    protected $fillable = [
        'user_id', 'follower_id'
    ];
}
