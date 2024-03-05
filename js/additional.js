function $_GET(param) {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if (param) {
        return vars[param] ? vars[param] : null;
    }

    return vars;
}

function crCoreConfirm(title, content, callbackOk, callbackCancel, locale, appendSelector, modalType, callbackOnShow) {
    var modelDefaultType = 'primary'; // modal-info, modal-warning, modal-success, modal-danger
    if(modalType == "" || modalType == null) {
        modalType = modelDefaultType;
    }
    locale = $.extend({
        ok: 'OK',
        cancel: 'Cancel'
    }, locale);
    var template = '<div id="modal-confirm" class="modal fade" style="display:none;"><div class="modal-dialog"><div class="modal-content"><div class="modal-header bg-' + modalType + '"><button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body"><p>' + content + '</p></div><div class="modal-footer"><a data-dismiss="modal" class="btn btn-link" href="javascript:void(0)">' + locale.cancel + '</a><button class="btn btn-'+ modalType +'" type="button">' + locale.ok + '</button></div></div></div></div>';
    var modal = $(template).appendTo(appendSelector||'body');
    $(modal).
    modal('show').
    on('shown.bs.modal', function() {
        if (typeof callbackOnShow === 'function') {
            callbackOnShow();
        }
        $('button', modal).bind('click', function(e) {
            e.preventDefault();
            if (typeof callbackOk === 'function') {
                callbackOk(e);
            }
        });
    }).
    on('hidden.bs.modal', function() {
        $(modal).remove();
        if (typeof callbackCancel === 'function') {
            callbackCancel();
        }
    });
    return modal;
}

function crCoreMessage(title, content, callback, btnTitle, appendSelector, modalType) {
    var modelDefaultType = 'primary'; // modal-info, modal-warning, modal-success, modal-danger
    if(modalType == "" || modalType == null) {
        modalType = modelDefaultType;
    }
    var btnDefaultTitle = 'OK';
    if(btnTitle == "" || btnTitle == null) {
        btnTitle = btnDefaultTitle;
    }
    var template = '<div id="modal-alert" class="modal fade" style="display:none;"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header bg-' + modalType + '"><button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body"><p>' + content + '</p></div><div class="modal-footer"><button data-dismiss="modal" class="btn btn-'+ modalType +'" type="button">'+ btnTitle +'</button></div></div></div></div>';
    var modal = $(template).appendTo(appendSelector||'body');
    $(modal).modal('show').on('hidden.bs.modal',function() {
        $(modal).remove();
        $('button', modal).bind('click', function(e) {
            e.preventDefault();
            if (typeof callback === 'function') {
                callback(e);
            }
        });
    });
}

function crCoreLoading(message,appendSelector) {
    var loading = $('<div />',{
        id: 'modal-loading',
        'class': 'modal-primary modal',
        'role': 'dialog',
        style: 'display: none;'
    })
        .data('backdrop','static')
        .append($('<div />',{'class': 'modal-dialog'})
            .append($('<div />',{'class': 'modal-content'})
                .append($('<div />',{'class': 'modal-body'})
                    .append($('<i/>',{
                        'class': 'icon-spinner icon-spin',
                        style: 'font-size:16px'
                    }).after('<strong style="line-height:16px;padding:0 0 0 10px;">' + message + '</strong>')))));

    $(loading).
    appendTo($(appendSelector||'body')).
    modal('show').
    on('hidden',function() {
        $(loading).remove();
    });

    return loading;
}

var cartIconFixed = $('.busket-link__product-count');

function changeCount(count) {
    $(".busket-link__product-count").each(function(el) {
        $(this).fadeOut(200, function () {
            $(this).find('span').text(count);
            $(this).fadeIn(500);
        });
    });
}

function updateElement(element, data) {
    element.each(function(el) {
        $(this).fadeOut(200, function () {
            $(this).text(data);
            $(this).fadeIn(500);
        });
    });
}

function getCartItems() {
    $.get('/cart/amount',
        function(resp) {
            if(resp.amount != undefined) {
                changeCount(resp.amount);
            } else {
                $.growl.error({
                    title: '',
                    message: resp.error,
                    size: 'large'
                });
            }
        }, 'json');
}

function initSearch() {
    $('form.search input').typeahead({
        minLength: 3,
        highlight: true
    }, {
        async: true,
        display: 'title',
        source: function (query, process, asyncResults) {
            $.get('/catalog/search-autocomplete', {q: query}, function (result) {
                return asyncResults(result);
            });
        },
        templates: {
            suggestion: function(data) {
                return '<a href="'+data.href+'" title="'+data.title+'"><div class="img-wrap"><img src="'+data.image+'"/></div><span>'+data.title+'</span></a>';
            }
        },
        limit: Infinity
    });
}

$(document).ready(function() {
    $('input[type="tel"], input.tel').inputmask({
        mask: '+7 (999) 999-99-99',
        showMaskOnHover: false
    });

    $('button.sorting__btn').on('click', function(e) {
        e.preventDefault();
        var cookieName = "grid_mode";
        var cssClass = "sorting__btn--active";

        if($(this).hasClass("list")) {
            $.cookie(cookieName, "list", { path: '/' });
            $(this).toggleClass(cssClass);
            $("button.sorting__btn.tile").toggleClass(cssClass);
        } else {
            $.cookie(cookieName, "tile", { path: '/' });
            $(this).toggleClass(cssClass);
            $("button.sorting__btn.list").toggleClass(cssClass);
        }
        // add code...

    });


    $('button.product-counter__btn').on('click', function(e) {
        e.preventDefault();
        var btn = $(this),
            input = $(this).closest('.product-counter').find('input.product-counter__input'),
            productId = parseInt(input.attr('data-id')),
            maxQty = parseInt(input.attr('max')),
            qty = parseInt(input.val());

        if(qty > maxQty) {
            qty = maxQty;
            input.val(qty);
        }

        if(productId && qty) {
            $.post('/cart/add', {productId: productId, qty: qty},
                function(resp) {
                    if(resp.amount != undefined && resp.message != undefined) {
                        changeCount(resp.amount);
                        $.growl.notice({
                            title: '',
                            message: resp.message,
                            size: 'large'
                        });
                    } else {
                        $.growl.error({
                            title: '',
                            message: resp.error,
                            size: 'large'
                        });
                    }
                }, 'json');
        }
    });

    $('a.product-favoriteadd').off('click').on('click', function(e) {
        e.preventDefault();
        var favorite = $(this),
            productId = parseInt(favorite.parents('.product-item').data('id')),
            action = favorite.data('action');

        if(productId) {
            $.get('/cart/toggle-favorite', {id: productId, action: action},
                function(resp) {
                    if(resp.message != undefined) {
                        $.growl.notice({
                            title: '',
                            message: resp.message,
                            size: 'large'
                        });

                        if (resp.count != undefined) {
                            $('.favorite-link__count').removeClass('hide');
                            $('.favorite-link__count>span').text(resp.count);
                        }

                        if (action == 'del') {
                            favorite.parents('.product__col').remove();
                            if (resp.count < 1) {
                                $.pjax.reload({container: '#pjax_box', async: false});
                            }
                        }
                    } else {
                        $.growl.error({
                            title: '',
                            message: resp.error,
                            size: 'large'
                        });
                    }
                }, 'json');
        }
    });

    getCartItems();
    initSearch();
});
