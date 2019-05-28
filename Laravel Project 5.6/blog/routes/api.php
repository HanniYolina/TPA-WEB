<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/registerGuest', 'GuestController@store');
Route::post('/registerOwner', 'OwnerController@store');

Route::post('/login/owner', 'OwnerController@login');
Route::post('/login/guest', 'GuestController@login');

Route::middleware('jwt.auth')->group(function(){
    Route::post('/getUser', 'UserController@getLoggedUser');
    Route::post('/email/createToken', 'VerifyEmailController@Store');
    Route::post('/phone/createToken', 'VerifyPhoneController@Store');
    Route::post('/logout', 'UserController@logout');
    Route::post('/uploadProfilePicture', 'UserController@uploadPP');
    Route::post('/getProfilePicture', 'UserController@getPP');
    Route::post('/uploadProfile', 'UserController@uploadProfile');
    Route::post('/updateUsername', 'UserController@updateUsername');
    Route::post('/changePassword', 'UserController@changePassword');

    Route::post('/follow', 'UserFollowerController@store');
    Route::post('/getUserFollow', 'UserFollowerController@getUserFollow');
    Route::post('/unfollow', 'UserFollowerController@destroyFollow');

    //admin
    Route::post('/addFacilities', 'FacilitiesController@Store');
    Route::post('/updateFacilities', 'FacilitiesController@updateFacilities');
    Route::post('/destroyFacilities', 'FacilitiesController@destroyFacilities');

    Route::post('/getFacilitiesByGroup', 'FacilitiesController@getFacilitiesByGroup');
    Route::post('/getFacilitiesById', 'FacilitiesController@getFacilitiesById');
    Route::post('/getFacilities', 'FacilitiesController@getFacilities');

    Route::post('/getAllFollowing', 'UserFollowerController@getAllFollowing');
    Route::post('/getOwnerOrGuest', 'UserController@getGuestOrOwner');
    Route::post('/banUser', 'UserController@banUser');

    Route::post('/addPremiumProduct', 'PremiumProductController@store');
    Route::post('/getAllPremium', 'PremiumProductController@getAllPremium');
    Route::post('/destroyPremium', 'PremiumProductController@destroyPremium');
    Route::post('/getPremiumById', 'PremiumProductController@getPremiumById');
    Route::post('/updatePremium', 'PremiumProductController@updatePremium');
    Route::post('/addPromo', 'PremiumProductController@addPromo');

    //owner
    Route::post('/addRoom', 'KostController@addRoom');
    Route::post('/destroyRoom', 'PropertiesController@destroyRoom');
    Route::post('/getAllRoom', 'KostController@getAllRoomByOwnerId');
    Route::post('/updateRoom', 'PropertiesController@updateRoom');

    Route::post('/addApartment', 'ApartmentController@addApartment');
    Route::post('/getAllApartment', 'ApartmentController@getAllApartmentByOwnerId');
    Route::post('/updateApartment', 'PropertiesController@updateApartment');

    Route::post('/orderPremium', 'PremiumPurchaseController@orderPremium');
    Route::post('/payPremium', 'PremiumPurchaseController@payPremium');
    Route::post('/addPremiumOwner', 'PremiumOwnerController@addPremiumOwner');
    Route::post('/getPremiumOwnerById', 'PremiumOwnerController@getPremiumOwnerById');
    Route::post('/sendPDF', 'PremiumOwnerController@sendPDF');
});

Route::get('/verifyEmail/{token}/{email}', 'VerifyEmailController@VerifyEmail');
Route::get('/verifyPhone/{token}/{phone}', 'VerifyPhoneController@VerifyPhone');

Route::post('/getRoom', 'PropertiesController@getRoom');
Route::post('/getRoomById', 'PropertiesController@getRoomById');
Route::post('/getRoomByOwnerId', 'PropertiesController@getRoomByOwnerId');
Route::post('/getOwner', 'UserController@getUserById');