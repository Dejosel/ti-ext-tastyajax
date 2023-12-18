<div class="menu-list">
    @if ($menuIsGrouped)
        @partial('@grouped_ajax')
    @else
       @partial('@items_ajax', ['menuItems' => $menuList])
    @endif

    <div class="pagination-bar text-right">
        <div class="links">{!! $menuList->links() !!}</div>
    </div>
</div>