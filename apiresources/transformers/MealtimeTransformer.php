<?php

namespace Dejosel\TastyAjax\ApiResources\Transformers;

use Admin\Models\Mealtimes_model;
use Carbon\Carbon;
use League\Fractal\TransformerAbstract;

class MealtimeTransformer extends TransformerAbstract
{
    public function transform(Mealtimes_model $mealTime)
    {
        $startTimeFormatted = Carbon::createFromFormat('H:i:s', $mealTime->start_time)->format('h:i A');
        $endTimeFormatted = Carbon::createFromFormat('H:i:s', $mealTime->end_time)->format('h:i A');

        return [
            'mealtime_id'=> $mealTime->mealtime_id ,
            'mealtime_name'=> $mealTime->mealtime_name ,
            'start_time'=> $startTimeFormatted,
            'end_time'=>$endTimeFormatted,
            'mealtime_status'=> $mealTime->mealtime_status ,
        ];
    }
}
