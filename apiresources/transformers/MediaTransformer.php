<?php

namespace Dejosel\TastyAjax\ApiResources\Transformers;

use Igniter\Flame\Database\Attach\Media;
use League\Fractal\TransformerAbstract;

class MediaTransformer extends TransformerAbstract
{
    public function transform(Media $media)
    {
        return  [
            'Url' => $media->path,            
        ];
    }
}
