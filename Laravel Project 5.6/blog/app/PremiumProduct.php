<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PremiumProduct extends Model
{

    use SoftDeletes;
    protected $keyType = 'string';
    protected $perPage = 10;
    protected $guarded = [

    ];

    protected $casts = [
        'duration' => 'array',
    ];
}
