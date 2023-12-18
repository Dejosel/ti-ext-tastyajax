let collapsedMenus = {};

$(document).on('hidden.bs.collapse', '.collapse', function () {
    let collapseId = this.id;
    collapsedMenus[collapseId] = $(this).children().detach();
    $(this).empty();
});

$(document).on('show.bs.collapse', '.collapse', function () {
    let collapseId = this.id;
    let $this = $(this);
    if (collapsedMenus[collapseId] && collapsedMenus[collapseId].length > 0) {
        $this.append(collapsedMenus[collapseId]);
        delete collapsedMenus[collapseId];
    }
});
function searchMenus(inputText) {
    if (inputText !== '') {
        $.ajax({
            url: "/tastyigniter/api/menusAjax",
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                const filteredMenus = response.data.filter(menu =>
                    menu.attributes.Nombre.toLowerCase().includes(inputText.toLowerCase())
                );
            
                if (filteredMenus.length > 0) {
                    let menusSearchHtml = buildMenusHtmlForSearch(filteredMenus, response.included);
                    $('#menusData').html(menusSearchHtml);
                } else {
                    $('#menusData').html('<p>No se encontraron menús.</p>');
                }
            },
            error: function(error) {
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    } else {
        $.ajax({
            url: "/tastyigniter/api/tastyajax",
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                let menusHtml = buildMenusHtml(response.data, response.included);
                $('#menusData').html(menusHtml);        
            },
            error: function(error) {
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    }
}

function buildMenusHtml(data, included) {
    const sortedCategories = data.filter(category =>
        category.attributes.Estado &&
        category.relationships.menus.data.length > 0
    )
    .sort((a, b) => a.attributes.Prioridad - b.attributes.Prioridad);

    let html = '<div class="menu-group">';
    html += '<div class="menu-group-item">';

    sortedCategories.forEach((category, index) => {
        let collapseCategoriesAfter = $('#menuCollapseCategoriesAfter').val();
        let isCollapsed = index >= collapseCategoriesAfter;

        let categoryHeading = `<div id="category-${category.attributes.Alias}-heading" role="tab" class="scroll_section">`;
        categoryHeading += `<h4 class="category-title cursor-pointer${isCollapsed ? ' collapsed' : ''}" `;
        categoryHeading += `data-bs-toggle="collapse" data-bs-target="#category-${category.attributes.Alias}-collapse" `;
        categoryHeading += `aria-expanded="${!isCollapsed}" data-category-name="${category.attributes.Alias}" `;
        categoryHeading += `aria-controls="category-${category.attributes.Alias}-heading">`;
        categoryHeading += `${category.attributes.Nombre}<i class="poco poco-icon-angle-up pull-right"></i></h4></div>`;

        let categoryCollapseDiv = `<div id="category-${category.attributes.Alias}-collapse" class="collapse ${index < collapseCategoriesAfter ? 'show' : ''}" role="tabpanel" aria-labelledby="${category.attributes.Alias}">`;
        categoryCollapseDiv += '<ul class="products margin-sus columns-3 mt-5">';

        if (category.relationships.menus.data.length > 0) {
            category.relationships.menus.data.forEach(menu => {
                let menuData = getMenuData(menu.id, included);
                let menuElementId = 'menu-' + menu.id;

                let mealtimeIsNotAvailable = !isMealtimeAvailable([{id: menu.id}], included);
                let hasOptions = MenuhasOptions([{id: menu.id}], included);
                let mealtimeInfo = '';
                let mealtime = getMealtimeInfo(menu.id, included);
                if (mealtime) {
                    mealtimeInfo = `Disponible durante ${mealtime.attributes.mealtime_name} (${mealtime.attributes.start_time}-${mealtime.attributes.end_time})`;
                }

                let productHtml = `<li id="${menuElementId}" class="product">`;
                productHtml += '<div class="product-item">';
                productHtml += '<div class="product-transition">';
                productHtml += `<a ${mealtimeIsNotAvailable ? '' : `data-cart-control="load-item" data-menu-id="${menu.id}" data-quantity="${menuData.minimum_qty}"`} >`;
                productHtml += `<div class="product-image">`;
                productHtml += `<img loading="lazy" src="${menuData.imageUrl}" class="mr-3" width="450" height="450" alt="${menuData.name}">`;
                productHtml += '</div></a></div>';
                productHtml += '<div class="product-caption">';
                productHtml += '<div class="product-caption-details">';
                productHtml += '<div class="menu-content">';
                productHtml += `<h5 class="menu-name">${menuData.name}</h5>`;
                productHtml += '</div>';
                productHtml += '<div class="product-menu-price"> ';
                productHtml += `<p>${menuData.currency}${menuData.price}</p>`;
                productHtml += '</div></div>';
                productHtml += '<div class="product-add-product">';
                if (!mealtimeIsNotAvailable) {
                    if (hasOptions) {
                        productHtml += `<span class="d-inline-block float-end">`;
                        productHtml += `<a class="btn btn-primary btn-sm btn-cart" data-cart-control="load-item" data-menu-id='${menu.id}' data-quantity='${menuData.minimum_qty}'>`;
                    } else {
                        productHtml += `<span>`;
                        productHtml += `<a class="btn btn-primary btn-sm btn-cart" data-request="cartBox::onUpdateCart" data-request-data="menuId: '${menu.id}', quantity: '${menuData.minimum_qty}'" data-replace-loading="spinner-border spinner-border-sm text-dark">`;
                    }
                } else {
                    productHtml += `<span class="d-inline-block float-end" data-bs-tooltip="tooltip" data-bs-placement="top" title="${mealtimeInfo}">`;
                    productHtml += `<a class="btn btn-primary btn-sm btn-cart disabled" title="${mealtimeInfo}">`;
                }
                
                productHtml += `<i class="poco-icon-${mealtimeIsNotAvailable ? 'clock' : 'shopping-basket'}"></i>`;
                productHtml += `</a>`;
                productHtml += `</span>`;
                productHtml += '</div>';
                productHtml += '</div></div></li>';

                categoryCollapseDiv += productHtml;
            });
        }

        categoryCollapseDiv += '</ul></div>';
        html += categoryHeading + categoryCollapseDiv;
    });

    html += '</div></div>';
    return html;
}


function buildMenusHtmlForSearch(menus, included) {
    let html = '<div class="menu-group">';
    html += '<div class="menu-group-item"> <ul class="products margin-sus columns-3 mt-5">';

    menus.forEach(menu => {
        let menuElementId = 'menu-' + menu.id;

        let mealtimeIsNotAvailable = !menu.relationships.mealtimes.data.length;
        let mealtimeInfo = '';
        if (menu.relationships.mealtimes.data && menu.relationships.mealtimes.data.length) {
            let mealtime = included.find(item => item.type === 'mealtimes' && item.id === menu.relationships.mealtimes.data[0].id);
            if (mealtime) {
                mealtimeInfo = `Disponible durante ${mealtime.attributes.mealtime_name} (${mealtime.attributes.start_time}-${mealtime.attributes.end_time})`;
            }
        }

        let productHtml = `<li id="${menuElementId}" class="product">`;
        productHtml += '<div class="product-item">';
        productHtml += '<div class="product-transition">';
        productHtml += `<a ${mealtimeIsNotAvailable ? '' : `data-cart-control="load-item" data-menu-id="${menu.id}" data-quantity="${menu.attributes.Cantidad_Min}"`} >`;
        productHtml += `<div class="product-image">`;
        productHtml += `<img loading="lazy" src="${included.find(item => item.type === 'media' && item.id === menu.relationships.media.data.id).attributes.Url}" class="mr-3" width="450" height="450" alt="${menu.attributes.Nombre}">`;
        productHtml += '</div></a></div>';
        productHtml += '<div class="product-caption">';
        productHtml += '<div class="product-caption-details">';
        productHtml += '<div class="menu-content">';
        productHtml += `<h5 class="menu-name">${menu.attributes.Nombre}</h5>`;
        productHtml += '</div>';
        productHtml += '<div class="product-menu-price"> ';
        productHtml += `<p>${menu.attributes.currency}${menu.attributes.Precio}</p>`;
        productHtml += '</div></div>';
        productHtml += '<div class="product-add-product">';
        if (mealtimeIsNotAvailable) {
            productHtml += `<span class="d-inline-block float-end">`;
            productHtml += `<a class="btn btn-primary btn-sm btn-cart" data-cart-control="load-item" data-menu-id='${menu.id}' data-quantity='${menu.attributes.Cantidad_Min}'>`;
            productHtml += `<i class="poco-icon-shopping-basket"></i>`;
            productHtml += `</a>`;
            productHtml += `</span>`;
        } else {
            productHtml += `<span class="d-inline-block float-end" data-bs-tooltip="tooltip" data-bs-placement="top" title="${mealtimeInfo}">`;
            productHtml += `<a class="btn btn-primary btn-sm btn-cart disabled" title="${mealtimeInfo}">`;
            productHtml += `<i class="poco-icon-clock"></i>`;
            productHtml += `</a>`;
            productHtml += `</span>`;
        }
        productHtml += '</div>';
        productHtml += '</div></div></li>';

        html += productHtml;
    });

    html += '</ul></div></div>';
    return html;
}

function getMenuData(menuId, included) {
    let menu = included.find(item => item.type === 'Menus' && item.id === menuId);

    if (menu && menu.attributes) {
        return {
            imageUrl: getMenuImageUrl(menu.id, included),
            name: menu.attributes.Nombre,
            description: menu.attributes.Descripcion,
            minimum_qty: menu.attributes.Cantidad_Min,
            price: menu.attributes.Precio,
            currency: menu.attributes.currency
        };
    } else {
        // Handle the case where menu data is not available
        return {
            imageUrl: '',
            name: 'Menu Name Not Available',
            description: 'Menu Description Not Available',
            price: 'N/A',
            currency: 'N/A'
        };
    }
}

function getMenuImageUrl(menuId, included) {
    let menu = included.find(item => item.type === 'Menus' && item.id === menuId);

    if (menu && menu.relationships && menu.relationships.media && menu.relationships.media.data) {
        let mediaId = menu.relationships.media.data.id;
        let media = included.find(item => item.type === 'media' && item.id === mediaId);

        if (media && media.attributes) {
            return media.attributes.Url;
        }
    }

    // Handle the case where menu image data is not available
    return '';
}

function convertTimeTo24Hour(time) {
    const [hour, minute, period] = time.split(/[:\s]/);
    let hour24 = parseInt(hour, 10);

    if (period === 'PM' && hour24 < 12) {
        hour24 += 12;
    }

    if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
    }

    return `${hour24.toString().padStart(2, '0')}:${minute}`;
}

function isMealtimeAvailable(menusData, included) {
    const orderDateTimeString = $('#orderDateTime').val();
    const orderDateTime = new Date(orderDateTimeString);

    for (let i = 0; i < menusData.length; i++) {
        const menuId = menusData[i].id;
        const menu = included.find(item => item.type === 'Menus' && item.id === menuId);

        if (menu && menu.relationships && menu.relationships.mealtimes && menu.relationships.mealtimes.data.length > 0) {
            const mealtimeId = menu.relationships.mealtimes.data[0].id;
            const mealtime = included.find(item => item.type === 'mealtimes' && item.id === mealtimeId);

            if (mealtime && mealtime.attributes && mealtime.attributes.mealtime_status) {
                const mealtimeStart = convertTimeTo24Hour(mealtime.attributes.start_time);
                const mealtimeEnd = convertTimeTo24Hour(mealtime.attributes.end_time);

                const startDateTime = new Date(orderDateTime);
                const [startHour, startMinute] = mealtimeStart.split(':');
                startDateTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0, 0);

                const endDateTime = new Date(orderDateTime);
                const [endHour, endMinute] = mealtimeEnd.split(':');
                endDateTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0, 0);

                const currentTime = orderDateTime.getTime();
                const startMillis = startDateTime.getTime();
                const endMillis = endDateTime.getTime();

                if (currentTime >= startMillis && currentTime <= endMillis) {
                    return true;
                }else
                {
                    return false;
                }
            }
        }
    }

    return true;
}
function MenuhasOptions(menusData, included) {

    for (let i = 0; i < menusData.length; i++) {
        const menuId = menusData[i].id;
        const menu = included.find(item => item.type === 'Menus' && item.id === menuId);

        if (menu && menu.relationships && menu.relationships.menu_options && menu.relationships.menu_options.data.length > 0) {
            
            return true;

        }
    }
}

function getMealtimeInfo(menuId, included) {
    let menu = included.find(item => item.type === 'Menus' && item.id === menuId);

    if (menu && menu.relationships && menu.relationships.mealtimes && menu.relationships.mealtimes.data.length > 0) {
        let mealtimeId = menu.relationships.mealtimes.data[0].id;
        return included.find(item => item.type === 'mealtimes' && item.id === mealtimeId);
    }

    return null;
}


function showToast(message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
    });

    Toast.fire({
        icon: 'success',
        title: message,
    });
}
const cartCountSpan = $('[data-cart-count]');


let initialCount = parseInt(cartCountSpan.text());


const observer = new MutationObserver(function (mutationsList) {
    const newCount = parseInt(cartCountSpan.text());

    if (newCount > initialCount) {
        showToast('Menú agregado exitosamente!');
    } else if (newCount < initialCount) {
        showToast('Menú actualizado exitosamente!');
    }


    initialCount = newCount;
});


const config = { childList: true, subtree: true };
observer.observe(cartCountSpan[0], config);

$('#searchInput').on('keyup', function() {
    const inputText = $(this).val().trim();
    searchMenus(inputText);
});

const initialInputText = $('#searchInput').val().trim();
searchMenus(initialInputText);

$('#clearButton').on('click', function() {
    $('#searchInput').val(''); 
    searchMenus('');
});