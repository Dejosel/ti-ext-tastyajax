<?php

namespace Dejosel\TastyAjax\ApiResources\Transformers;

use Admin\Models\Menu_item_options_model;
use League\Fractal\TransformerAbstract;

class MenuItemOptionTransformer extends TransformerAbstract
{
    public function transform(Menu_item_options_model $menuItemOption)
    {
        return  [
            'id' => $menuItemOption->menu_option_id,
            'option' => $menuItemOption->option,
        ];
    }
    
}
