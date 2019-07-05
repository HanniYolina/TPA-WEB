<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class RoomStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'owner_id' => 'required',
            'name' => 'required',
            'description' => 'required|min:8',
            'price' => 'required',
            'room_left' => 'required',
            'city' => 'required',
            'gender_type' => 'required',

            'parking_facilities' => '',
            'picture_name' => '',
            'room_facilities' => '',
            'room_area' => '',
            'banner_name' => '',
            'video_name' => '',
            'picture360_name' => '',
            'public_facilities' => '',
            'additional_info' => '',
            'additional_fee' => '',

            'latitude' => '',
            'longitude' => '',
//            'picture_name' => 'sometimes|nullable|mimes:jpeg,jpg,png',
//            'banner_picture' => 'sometimes|nullable|mimes:jpeg,jpg,png',
//            'video' => 'sometimes|nullable|mimes:mp4,mov,ogg,qt | max:20000',
//            'picture_360' => 'sometimes|nullable|mimes:jpeg,png'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors()));
    }
}
