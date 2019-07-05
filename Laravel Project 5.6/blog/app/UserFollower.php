<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserFollower extends Model
{
    protected $keyType = 'string';
    protected $perPage = 10;
    protected $fillable = [
        'user_id', 'follower_id'
    ];
}
