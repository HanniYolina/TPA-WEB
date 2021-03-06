<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use SoftDeletes;
    protected $keyType = 'string';
    protected $perPage = 10;
    protected $guarded = [

    ];

    protected $casts = [
        'stars' => 'array'
    ];
}
