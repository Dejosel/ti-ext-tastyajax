<?php

namespace Dejosel\TastyAjax\Components;

use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Redirect;
use Igniter\Local\Facades\Location;
use Admin\Models\Locations_model;
use Admin\Models\Menus_model;

class MenuAjax extends \Igniter\Local\Components\Menu
{
    public function defineProperties()
    {
        return [
            'isGrouped' => [
                'label' => 'Group menu items list by category',
                'type' => 'switch',
                'validationRule' => 'required|boolean',
            ],
            'collapseCategoriesAfter' => [
                'label' => 'Collapse after how many categories',
                'type' => 'number',
                'default' => 5,
                'validationRule' => 'required|integer',
            ],
            'menusPerPage' => [
                'label' => 'Menus Per Page',
                'type' => 'number',
                'default' => 20,
                'validationRule' => 'required|integer',
            ],
            'showMenuImages' => [
                'label' => 'Show Menu Item Images',
                'type' => 'switch',
                'default' => false,
                'validationRule' => 'required|boolean',
            ],
            'menuImageWidth' => [
                'label' => 'Menu Thumb Width',
                'type' => 'number',
                'span' => 'left',
                'default' => 95,
                'validationRule' => 'integer',
            ],
            'menuImageHeight' => [
                'label' => 'Menu Thumb Height',
                'type' => 'number',
                'span' => 'right',
                'default' => 80,
                'validationRule' => 'integer',
            ],
            'menuCategoryWidth' => [
                'label' => 'Category Thumb Width',
                'type' => 'number',
                'span' => 'left',
                'default' => 1240,
                'validationRule' => 'integer',
            ],
            'menuCategoryHeight' => [
                'label' => 'Category Thumb Height',
                'type' => 'number',
                'span' => 'right',
                'default' => 256,
                'validationRule' => 'integer',
            ],
            'defaultLocationParam' => [
                'label' => 'The default location route parameter (used internally when no location is selected)',
                'type' => 'text',
                'default' => 'local',
                'validationRule' => 'string',
            ],
            'localNotFoundPage' => [
                'label' => 'lang:igniter.local::default.label_redirect',
                'type' => 'select',
                'options' => [static::class, 'getThemePageOptions'],
                'default' => 'home',
                'validationRule' => 'regex:/^[a-z0-9\-_\/]+$/i',
            ],
            'hideMenuSearch' => [
                'label' => 'Hide the menu item search form',
                'type' => 'switch',
                'default' => false,
                'validationRule' => 'required|boolean',
            ],
            'forceRedirect' => [
                'label' => 'Whether to force a page redirect when no location param is present in the request URI.',
                'type' => 'switch',
                'default' => true,
                'validationRule' => 'required|boolean',
            ],
        ];
    }

    public function onRun()
    {
        if ($redirect = $this->checkLocationParam())
            return $redirect;

        //$this->page['menuIsGrouped'] = !strlen($this->param('category')) && $this->property('isGrouped');
        $this->page['menuCollapseCategoriesAfter'] = $this->property('collapseCategoriesAfter');
        $this->page['showMenuImages'] = $this->property('showMenuImages');
        $this->page['menuImageWidth'] = $this->property('menuImageWidth');
        $this->page['menuImageHeight'] = $this->property('menuImageHeight');
        $this->page['menuCategoryWidth'] = $this->property('menuCategoryWidth', 1240);
        $this->page['menuCategoryHeight'] = $this->property('menuCategoryHeight', 256);
        $this->page['menuAllergenImageWidth'] = $this->property('menuAllergenImageWidth', 28);
        $this->page['menuAllergenImageHeight'] = $this->property('menuAllergenImageHeight', 28);

        $this->page['hideMenuSearch'] = $this->property('hideMenuSearch');
        //$this->page['menuSearchTerm'] = $this->getSearchTerm();

        //$this->page['menuList'] = $this->loadList();
        //$this->page['menuListCategories'] = $this->menuListCategories;
        $this->addJs('js/menu-ajax.js', 'menuajax-js');
        $this->addCss('css/menu-ajax.css', 'menuajax-css');
    }

    protected function checkLocationParam()
    {
        if (!$this->property('forceRedirect', true))
            return;

        $param = $this->param('location', 'local');
        if (is_single_location() && $param === $this->property('defaultLocationParam', 'local'))
            return;

        if (Locations_model::whereSlug($param)->isEnabled()->exists())
            return;

        return Redirect::to($this->controller->pageUrl($this->property('localNotFoundPage')));
    }
}
