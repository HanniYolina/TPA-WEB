<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PremiumOwner extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;
    protected $perPage = 10;
    protected $guarded = [

    ];

    protected $casts = [
        'duration' => 'array',
    ];
}
