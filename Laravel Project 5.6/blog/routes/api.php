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

    Route::post('/view', 'LatestViewController@store');
    Route::post('/getLatestView', 'LatestViewController@getLatestView');
    Route::post('/favorite', 'FavoriteController@favorite');
    Route::post('/getFavorite', 'FavoriteController@getFavorite');
    Route::post('/getAllFavoriteByUser', 'FavoriteController@getAllFavoriteByUser');

    Route::post('/createReport', 'ReportController@createReport');
    Route::post('/getReport', 'ReportController@getReport');

    Route::post('/countFollower', 'UserFollowerController@countFollower');
    Route::post('/countFollowing', 'UserFollowerController@countFollowing');

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
    Route::post('/resetPassword', 'UserController@resetPassword');

    Route::post('/addPremiumProduct', 'PremiumProductController@store');
    Route::post('/getAllPremium', 'PremiumProductController@getAllPremium');
    Route::post('/destroyPremium', 'PremiumProductController@destroyPremium');
    Route::post('/getPremiumById', 'PremiumProductController@getPremiumById');
    Route::post('/updatePremium', 'PremiumProductController@updatePremium');
    Route::post('/addPromo', 'PremiumProductController@addPromo');

    Route::post('/addTag', 'TagController@store');

    Route::post('/uploadImage', 'PostController@uploadImage');
    Route::post('/addPost', 'PostController@store');
    Route::post('/deletePost', 'PostController@deletePost');
    Route::post('/updatePost', 'PostController@updatePost');
    Route::post('/addDetailPost', 'DetailPostController@store');

    Route::post('/countUser', 'UserController@countUser');
    Route::post('/countPost', 'PostController@countPost');
    Route::post('/countPremiumProduct', 'PremiumProductController@countPremium');
    Route::post('/countFacility', 'FacilitiesController@countFacility');
    Route::post('/countTransaction', 'PremiumPurchaseController@countTransaction');

    Route::post('/banProperties', 'PropertiesController@banProperties');

    Route::post('/getFilteredUser', 'UserController@getFilteredUser');
    Route::post('/getFilteredFacility', 'FacilitiesController@getFilteredFacility');

//    Route::post('/getFilteredPremium', 'PremiumProductController@getFilteredPremium');

    Route::post('/addReview', 'ReviewController@store');

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
    Route::post('/sendPDF', 'PremiumOwnerController@sendPDF');
    Route::post('/getAllTransaction', 'PremiumPurchaseController@getAllTransaction');
    Route::post('/getCompletedTransaction', 'PremiumPurchaseController@getCompletedTransaction');
    Route::post('/getAllPremiumByUserId', 'PremiumOwnerController@getAllPremiumByUserId');

    Route::post('/countProperties', 'PropertiesController@countProperties');

});

Route::post('/getPremiumOwnerById', 'PremiumOwnerController@getPremiumOwnerById');

Route::get('/verifyEmail/{token}/{email}', 'VerifyEmailController@VerifyEmail');
Route::get('/verifyPhone/{token}/{phone}', 'VerifyPhoneController@VerifyPhone');

Route::post('/getRoom', 'PropertiesController@getRoom');
Route::post('/getRoomById', 'PropertiesController@getRoomById');
Route::post('/getRoomByOwnerId', 'PropertiesController@getRoomByOwnerId');
Route::post('/getOwner', 'UserController@getUserById');


Route::post('/getAllPost', 'PostController@getAllPost');
Route::post('/getPostById', 'PostController@getPostById');
Route::post('/getTagNameById', 'TagController@getTagNameById');

//
//Route::post('/test', 'UserController@test');
Route::post('/sendChat', 'UserController@sendChat');
Route::post('/getAllChat', 'UserController@getAllChat');
Route::post('/getChatList', 'UserController@getChatList');

Route::post('/search', 'PropertiesController@search');
Route::post('/getNearestApartment', 'PropertiesController@getNearestApartment');
Route::post('/getNearestKost', 'PropertiesController@getNearestKost');

Route::post('/loginNotif', 'UserController@loginNotif');

Route::post('/getAllTag', 'TagController@getAllTag');
Route::post('/getFilteredPost', 'PostController@getFilteredPost');
Route::post('/getAllRecommendedPost', 'PostController@getAllRecommendedPost');

Route::post('/countFavorite', 'FavoriteController@countFavorite');

Route::post('/getAllReview', 'ReviewController@getAllReview');

Route::post('/getRadius', 'PropertiesController@getRadius');