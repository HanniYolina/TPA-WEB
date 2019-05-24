<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ApartmentStoreRequest extends FormRequest
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
            'city' => 'required',

            'unit_type' => 'required',
            'unit_condition' => 'required',
            'unit_floor' => 'required',

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

            'address' => 'required'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors()));
    }
}
