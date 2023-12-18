<?php

namespace Dejosel\TastyAjax\ApiResources\Repositories;

use Admin\Models\Categories_model;
use Igniter\Api\Classes\AbstractRepository;

class CategoriesRepository extends AbstractRepository
{
    protected $modelClass = Categories_model::class;

    protected static $locationAwareConfig = [];
}