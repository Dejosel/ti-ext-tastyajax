<?php namespace Dejosel\TastyAjax\ApiResources;

use Igniter\Api\Classes\ApiController;
use Dejosel\TastyAjax\Requests\Category;


/**
 * Categories API Controller
 */
class Categories extends ApiController
{
    public $implement = [
        'Igniter.Api.Actions.RestController'
    ];

    public $restConfig = [
        'actions' => [
             'index' => [
                 'pageSize' => 1,
             ],
             'store' => [],
             'show' => [],
             'update' => [],
             'destroy' => [],
        ],
        'request' => Category::class,
        'repository' => Repositories\CategoriesRepository::class,
        'transformer' => Transformers\CategoriesTransformer::class,
    ];

    protected $requiredAbilities = ['categories:*'];
}
