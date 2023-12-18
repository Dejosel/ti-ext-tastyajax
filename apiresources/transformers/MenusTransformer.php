<?php

namespace Dejosel\TastyAjax\ApiResources\Transformers;

use Admin\Models\Menus_model;
use Igniter\Local\Facades\Location;
use Igniter\Api\ApiResources\Transformers\AllergensTransformer;
use Igniter\Api\ApiResources\Transformers\StockTransformer;
use League\Fractal\TransformerAbstract;

class MenusTransformer extends TransformerAbstract
{
    protected $defaultIncludes = [
        'media',
        'mealtimes',
        'menu_options',
        /* 
        'allergens',
        ,
        'stocks' */
      ];   

    public function transform(Menus_model $menuItem)
    {
        return  [
            'Nombre' => $menuItem->menu_name,
            'Descripcion' => $menuItem->menu_description,
            'Precio' => $menuItem->menu_price,
            'Cantidad_Min' => $menuItem->minimum_qty,
            'Estado' => $menuItem->menu_status,
            'Prioridad' => $menuItem->menu_priority,
            'Restriccion' => $menuItem->order_restriction,
            'currency' => app('currency')->getDefault()->currency_code, 

        ];
    }

    public function includeMedia(Menus_model $menuItem)
    {
        if (!$thumb = $menuItem->getFirstMedia())
        return null;

        return $this->item($thumb, new MediaTransformer, 'media');
    }
    
    public function includeMealtimes(Menus_model $menuItem)
    {
        return $this->collection(
            $menuItem->mealtimes,
            new MealtimeTransformer,
            'mealtimes'
        );
    }
    public function includeMenuOptions(Menus_model $menuItem)
    {
        return $this->collection(
            $menuItem->menu_options,
            new MenuItemOptionTransformer,
            'menu_options'
        );
    }
    /* 
    public function includeAllergens(Menus_model $menuItem)
    {
        return $this->collection(
            $menuItem->allergens,
            new AllergensTransformer,
            'allergens'
        );
    }

    

    public function includeStocks(Menus_model $menuItem)
    {
        return $this->collection(
            $menuItem->stocks,
            new StockTransformer,
            'stocks'
        );
    } */
}
