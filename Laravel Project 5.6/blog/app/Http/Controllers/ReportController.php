<?php

namespace App\Http\Controllers;

use App\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    public function createReport(Request $request){
        $validate = Validator::make($request->all(),[
            'user_id' => 'required',
            'properties_id' => 'required',
            'contents' => 'required',
            'type' => 'required'
        ]);

        if($validate->fails()){
            return response()->json([
                'message' => $validate->errors()->first()
            ]);
        }
        $report = new Report();
        $report->id = Str::uuid();
        $report->user_id = $request->user_id;
        $report->properties_id = $request->properties_id;
        $report->report_content = $request->contents;
        $report->report_type = $request->type;
        $report->save();
    }

    public function getReport(){
        $reports = Report::paginate();
        return response()->json($reports);
    }
}
