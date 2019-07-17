<?php

namespace App\Http\Controllers;

use App\Notif;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NotifController extends Controller
{
    public function store(Request $request){
        $notif = new Notif();
        $notif->id = Str::uuid();
        $notif->content = $request->contents;
        $notif->user_id = $request->user_id;
        $notif->save();

        return "success";
    }

    public function getAllNotif(Request $request){
        $notifs = Notif::where('user_id', $request->user_id)->where('read_at', null)->get();

        return $notifs;
    }

    public function readAll(Request $request){
        $notifs = Notif::where('user_id', $request->user_id)->where('read_at', null)->get();

        foreach ($notifs as $n){
            $n->read_at = Carbon::now();
            $n->save();
        }

        return "success";
    }
}
