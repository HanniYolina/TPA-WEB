<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Kost extends Model
{
    protected $keyType = 'string';

    protected $guarded = [

    ];

    public function Properties()
    {
        return $this->morphOne('App\Properties', 'propertiesable');
    }
}
