<?php namespace Dejosel\TastyAjax\ApiResources;

use Igniter\Api\Classes\ApiController;
use Dejosel\TastyAjax\Requests\Menu;

/**
 * Menus API Controller
 */
class Menus extends ApiController
{
    public $implement = ['Igniter.Api.Actions.RestController'];

    public $restConfig = [
        'actions' => [
            'index' => [
                'pageLimit' => 50,
            ],
            'store' => [],
            'show' => [],
            'update' => [],
            'destroy' => [],
        ],
        'request' => Menu::class,
        'repository' => Repositories\MenusRepository::class,
        'transformer' => Transformers\MenusTransformer::class,
    ];

    protected $requiredAbilities = ['menus:*'];
}
