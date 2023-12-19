@if (!$hideMenuSearch)
<div class="filter-container mt-3 d-none d-md-flex">
    <input type="text" class="searchInput" placeholder="Buscar menú...">
    <div class="button-search-menu-ajax">
        <button class="clearButton" type="button">Limpiar</button>
    </div>
</div>
@else
<input type="hidden" class="searchInput">
@endif
<div class="products margin-sus columns-3 mt-5" id="menusData">
    <!-- here the menuAjax -->
</div>
<input type="hidden" id="orderDateTime" value="{{ Location::orderDateTime() }}">
<input type="hidden" id="menuCollapseCategoriesAfter" value="{{ $menuCollapseCategoriesAfter }}">
<input type="hidden" id="showMenuImages" value="{{ $showMenuImages }}">
<input type="hidden" id="menuImageWidth" value="{{ $menuImageWidth }}">
<input type="hidden" id="menuImageHeight" value="{{ $menuImageHeight }}">
<input type="hidden" id="menuCategoryWidth" value="{{ $menuCategoryWidth }}">
<input type="hidden" id="menuCategoryHeight" value="{{ $menuCategoryHeight }}">
<input type="hidden" id="menuAllergenImageWidth" value="{{ $menuAllergenImageWidth }}">
<input type="hidden" id="menuAllergenImageHeight" value="{{ $menuAllergenImageHeight }}">
