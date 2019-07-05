<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;
    protected $perPage = 10;

    protected $guarded = [

    ];
}
