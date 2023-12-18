<?php

namespace Dejosel\TastyAjax\ApiResources\Transformers;

use Admin\Models\Categories_model;
use League\Fractal\TransformerAbstract;
use Illuminate\Support\Str;

class CategoriesTransformer extends TransformerAbstract
{
    protected $defaultIncludes = [
      'menus'
    ];
    public function transform(Categories_model $category)
    {

        return [
          'id' => (int)$category->category_id,
          'Nombre' => $category->name,
          'Prioridad' => $category->priority,
          'Estado' => $category->status,
          'Alias' => Str::slug($category->name),
        ];
    }

    public function includeMenus(Categories_model $category)
    {
      return $this->collection($category->menus, new MenusTransformer, 'Menus');
    }
}