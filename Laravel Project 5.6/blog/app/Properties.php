<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Properties extends Model
{
    use SoftDeletes;
    protected $keyType = 'string';
    protected $perPage = 10;
    protected $guarded = [

    ];

    protected $casts = [
        'price' => 'array',
        'room_facilities' => 'array',
        'room_area' => 'array',
        'public_facilities' => 'array',
        'parking_facilities' => 'array',
        'additional_fee' => 'array',

    ];

    public function propertiesable(){
        return $this->morphTo();
    }
}
