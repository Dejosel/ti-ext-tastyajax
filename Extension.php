<?php namespace Dejosel\TastyAjax;

use System\Classes\BaseExtension;

/**
 * TastyAjax Extension Information File
 */
class Extension extends BaseExtension
{
    /**
     * Register method, called when the extension is first registered.
     *
     * @return void
     */
    public function register()
    {

    }

    /**
     * Boot method, called right before the request route.
     *
     * @return void
     */
    public function boot()
    {

    }

    /**
     * Registers any front-end components implemented in this extension.
     *
     * @return array
     */
    public function registerComponents()
    {
        return [
            \Dejosel\TastyAjax\Components\MenuAjax::class => [
                'code' => 'menuajax',
                'name' => 'Menu Ajax',
                'description' => 'Carga Menu de Categorias mediante Ajax',
            ],
        ];
    }

    public function registerApiResources()
    {
        return [
            'menusAjax' => [
                'controller' => \Dejosel\TastyAjax\ApiResources\Menus::class,
                'name' => 'Menus',
                'description' => 'An API resource for ajax menus',
                'actions' => [
                    'index:all', 'show:all',
                ],
            ],
            'tastyajax' => [
                'controller' => \Dejosel\TastyAjax\ApiResources\Categories::class,
                'name' => 'Categories & menu',
                'description' => 'An API resource for ajax categories & menus',
                'actions' => [
                    'index:all', 'show:all',
                ],
            ],
        ];
    }

    /**
     * Registers any admin permissions used by this extension.
     *
     * @return array
     */
    public function registerPermissions()
    {
// Remove this line and uncomment block to activate
        return [
//            'Dejosel.TastyAjax.SomePermission' => [
//                'description' => 'Some permission',
//                'group' => 'module',
//            ],
        ];
    }
}
