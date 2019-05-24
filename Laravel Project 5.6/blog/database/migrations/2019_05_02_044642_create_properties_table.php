<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('owner_id');

            //2
            $table->string('name');
            $table->string('description');
            $table->longText('price');
//            $table->integer('room_left');
            $table->string('city');

            //3
            $table->string('picture_name')->nullable();
            $table->longText('room_facilities')->nullable();
            $table->longText('room_area')->nullable();
            $table->string('banner_name')->nullable();
            $table->string('video_name')->nullable();
            $table->string('picture360_name')->nullable();

            //4
            $table->longText('public_facilities')->nullable();
//            $table->longText('parking_facilities')->nullable();
            $table->string('additional_info')->nullable();
            $table->longText('additional_fee')->nullable();

            $table->longText('address');

            //morph
            $table->uuid('propertiesable_id');
            $table->string('propertiesable_type');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('properties');
    }
}
