// Animation On Scroll Class
class AnimationOnScroll {
  constructor(props) {
    // props
    this.jsonUrl = props.jsonUrl;
    this.aosOptions = props.aosOptions;
    this.animations = {};
  }

  getPage() {
    return $('main').attr('class');
  }

  getAnimationOptions() {
    $.ajax({
      type: 'GET',
      url: this.jsonUrl, // demo
      dataType: 'json',
      success: response => {
        this.animations = response; // saving
        this.animate();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log('animations GET error: ' + this.jsonUrl + ' - ' + errorThrown + '!');
      },
    }).done(() => {
      AOS.init(this.aosOptions);
    });
  }

  setAttrs(el) {
    const elements = $(el.el);

    // accept empty animations obj
    el.animation = el.animation !== undefined ? el.animation : {};

    // set animation class
    elements.attr('data-aos', el.animation.class !== undefined ? el.animation.class : 'fade-up');
    // set animation duration
    if (el.animation.duration !== undefined) {
      elements.attr('data-aos-duration', el.animation.duration);
    }
    // set animation offset
    if (el.animation.offset !== undefined) {
      elements.attr('data-aos-offset', el.animation.offset);
    }

    // set animation delay
    if (el.animation.increment) {
      // increment animation
      let delay = el.animation.direction === 'reverse' ? elements.length + '00' : 0;
      const maxIteration = el.animation.maxIteration !== undefined ? el.animation.maxIteration : elements.length;

      for (let i = 0; i < maxIteration; i++) {
        $(elements[i]).attr('data-aos-delay', delay);
        delay = el.animation.direction === 'reverse' ? (delay -= 100) : (delay += 100);
      }
    } else {
      // single animation
      if (el.animation.delay !== undefined) {
        elements.attr('data-aos-delay', el.animation.delay);
      }
    }
  }

  animate() {
    const currentPage = this.animations[this.getPage()];
    // Common animations init
    this.animations.common.forEach(el => {
      // init only visible elements
      if ($(el.el).is(':visible')) {
        this.setAttrs(el);
      }
    });

    // Current page animations init
    if (currentPage !== undefined) {
      currentPage.forEach(el => {
        // init only visible elements
        if ($(el.el).is(':visible')) {
          this.setAttrs(el);
        }
      });
    }
  }

  init() {
    this.getAnimationOptions();
  }
}

////////// Responsive
// Breackpoints
const xl = '(max-width: 1280px)',
  lg = '(max-width: 991px)',
  md = '(max-width: 768px)',
  sm = '(max-width: 575px)',
  xsm = '(max-width: 375px)',
  minLg = '(min-width: 992px)',
  minMd = '(min-width: 768px)',
  MQ = $.mq.action;
// MediaQueries

// LG Breackpoint
MQ(
  lg,
  function () {
    const mobileRow = $('.mobile-menu__bottom-row');

    if (!$('.dropdown-menu-box').length) {
      $('.mobile-menu__right-col').prepend($('.header__user-panel-link'));
    } else {
      $('.mobile-menu__right-col').prepend($('.header__user-panel-link'));
      $('.mobile-menu__right-col').append($('.dropdown-menu-box'));
    }
    $('.mobile-menu__left-col').append($('.multilingual'));
    $('.mobile-menu__center-row').append($('.search'));
    mobileRow.prepend($('.header__phone'));
    mobileRow.prepend($('.nav'));
    $('.catalog__container').prepend($('.product-catalog__row--mobile'));
    $('.search').show();
    $('.sidebar').hide(300);
  },
  function () {
    // if (!$('.dropdown-menu-box').length) {
    //   $('.header__wrap:last-child').prepend($('.header__user-panel-link'));
    // } else {
    //   $('.dropdown-menu-box').prepend($('.header__user-panel-link'));
    // }
    $('.header__top-line').prepend($('.multilingual'));
    $('.header__bottom-line').prepend($('.search'));
    $('.header__nav-wrap').prepend($('.nav'));
    $('.header__top-line').append($('.header__phone'));
    $('.product-catalog__popup-content').prepend($('.product-catalog__row--mobile'));
    $('.search').hide();
    $('.sidebar').show(300);
    // productCatalogBreadCrumbs();
  },
);

MQ(
  minLg,
  function () {},
  function () {},
);

////////// Common functions
// functions launch
// productCatalogBreadCrumbs()
fixElements();
inputMask();
menuToggle();
popupOpener();
amountCounter();
filterResetBtn();
productItemHover();
moreDesciprition();
aosAnimationInit();
shippingSwitcher();
activeColorFilter();
singleProductSlider();
filterContentToggle();
searchPopupSwitcher();
discountMobileSlider();
productPriceCalculate();
productHeightSwitcher();
mobileFilterToggleBtn();
catalogProductBreadCrumbs();
productCatalogMobileSlider();
// $('.price-filter__range').length ? priceRange() : 0;

// on start page
function fixElements() {
  const scrollTop = $(window).scrollTop();
  const header = $('.header');
  const headerHeight = header.height();
  const widget = $('.widget');
  const aboutCompany = $('.about-company__row');
  const widgetLength = widget.length;
  const moreHeader = scrollTop > headerHeight;
  let aboutCompanyOffset;

  function blockSwitcherCond(cond) {
    if (cond) {
      header.addClass('header--scrolled');
      if (widgetLength) {
        widget.show(300);
      }
    } else {
      header.removeClass('header--scrolled');
      if (widgetLength) {
        widget.hide(300);
      }
    }
  }

  if (aboutCompany.length) {
    aboutCompanyOffset = aboutCompany.offset().top;
    blockSwitcherCond(moreHeader && scrollTop + $(window).height() / 2 + widget.height() / 2 < aboutCompanyOffset);
  } else {
    blockSwitcherCond(moreHeader);
  }
}

// Smooth scroll
function smoothScroll() {
  if (window.location.hash) {
    var hash = window.location.hash.substring(1);
    const headerTopOffset = $('.header').outerHeight() - 150;

    $('body, html').animate(
      {
        scrollTop: $('.' + hash).offset().top - headerTopOffset,
      },
      700,
    );
  }
}

// Popup opener
function popupOpener() {
  $('.js-popup').click(function (event) {
    event.preventDefault();
    const popupID = $(this).attr('href');

    mfpPopup(popupID);
  });
}

// Mobile menu toggle
function menuToggle() {
  $('.js-menu').click(function () {
    $('.js-menu').toggleClass('is-active');
    $('.mobile-menu').toggleClass('opened');
  });
}

// Phone input mask
function inputMask() {
  $('input[type="tel"]').inputmask({
    mask: '+7 (999) 999-99-99',
    showMaskOnHover: false,
  });
}

// Search popup Toggle
function searchPopupSwitcher() {
  $('.header__search-icon-wrap').click(function (e) {
    e.preventDefault();
    $('.search').show(300);
  });

  $('.search__popup-close-icon').click(function (e) {
    e.preventDefault();
    $('.search').hide(300);
  });
}

// Product amount counter
function amountCounter() {
  const plus = $('.product-counter__plus');
  const minus = $('.product-counter__minus');
  const input = $('.product-counter__input');

  input.change(function () {
    if ($(this).val() === '') {
      $(this).val(0);
    }
  });

  plus.click(function (e) {
    e.preventDefault();

    const $this = $(this).siblings('.input-wrap').find(input);
    const value = parseInt($this.val());
    $this.val(value + 1);
  });

  minus.click(function (e) {
    e.preventDefault();

    const $this = $(this).siblings('.input-wrap').find(input);
    let value = parseInt($this.val());

    if (value > 1) {
      value = value - 1;
    } else {
      value = 0;
    }
    $this.val(value);
  });
}

// Product Items Hover
function productItemHover() {
  const productItem = $('.product__item');

  productItem.hover(
    function () {
      MQ(
        minLg,
        () => {
          $(this).parent().css('z-index', '3');
          $(this).css('z-index', '3');
          $(this).find('.product-information').show(300);
        },
        () => {},
      );
    },
    function () {
      MQ(
        minLg,
        () => {
          $(this).parent().css('z-index', '0');
          $(this).css('z-index', '0');
          $(this).find('.product-information').hide(300);
        },
        () => {},
      );
    },
  );
}

// Product Height Switcher on load
function productHeightSwitcher() {
  const productItem = $('.product__item');
  const productItemHeight = productItem.outerHeight();

  MQ(
    minLg,
    function () {
      $('.product__item-wrap').height(productItemHeight);
    },
    function () {
      $('.product__item-wrap').css('height', '100%');
    },
  );
}

// More Desc Switcher
function moreDesciprition() {
  $('.about-company__more-btn').click(function (e) {
    e.preventDefault();
    const moreDesc = $(this).siblings('.about-company__desc--more');
    const dataText = $(this).attr('data-text');
    const dataMinText = $(this).attr('data-min-text');

    if (moreDesc.is(':visible')) {
      moreDesc.hide(300);
      $(this).text(dataText);
    } else {
      moreDesc.show(300);
      $(this).text(dataMinText);
    }
  });
}

// Init Discount Mobile Slider
function discountMobileSlider() {
  const discountSlider = $('.discount__row--mobile-slider');
  const discountSliderSettings = {
    loop: true,
    items: 1,
    margin: 0,
    nav: false,
    dots: true,
    autoHeight: false,
  };

  MQ(
    lg,
    function () {
      discountSlider.owlCarousel(discountSliderSettings).addClass('owl-carousel').trigger('refresh.owl.carousel');
    },
    function () {
      discountSlider.trigger('destroy.owl.carousel').removeClass('owl-carousel');
    },
  );
}

// Init Product Mobile Slider
function productCatalogMobileSlider() {
  const productCatalogMain = $('.product-catalog__row--mobile-slider');
  const productCatalog = $('.product-catalog__row--mobile');
  let productCatalogSliderSettings;

  function pageIdentifier() {
    if ($('.catalog').length) {
      productCatalogSliderSettings = {
        loop: true,
        items: 1,
        margin: 0,
        nav: false,
        dots: true,
        autoHeight: false,
        responsiveClass: true,
        responsive: {
          0: {
            items: 3,
          },
          375: {
            items: 3,
          },
          576: {
            items: 4,
          },
          767: {
            items: 5,
          },
          992: {
            items: 5,
          },
        },
      };
    } else {
      productCatalogSliderSettings = {
        loop: true,
        items: 1,
        margin: 0,
        nav: false,
        dots: true,
        autoHeight: false,
        responsiveClass: true,
        responsive: {
          0: {
            items: 2,
          },
          375: {
            items: 3,
          },
          576: {
            items: 3,
          },
          767: {
            items: 5,
          },
          992: {
            items: 6,
          },
          1200: {
            items: 7,
          },
        },
      };
    }
  }
  pageIdentifier();

  MQ(
    xl,
    function () {
      productCatalogMain.owlCarousel(productCatalogSliderSettings).addClass('owl-carousel').trigger('refresh.owl.carousel');
    },
    function () {
      productCatalogMain.trigger('destroy.owl.carousel').removeClass('owl-carousel');
    },
  );

  MQ(
    lg,
    function () {
      productCatalog.owlCarousel(productCatalogSliderSettings).addClass('owl-carousel').trigger('refresh.owl.carousel');
    },
    function () {
      productCatalog.trigger('destroy.owl.carousel').removeClass('owl-carousel');
    },
  );
}

// Mobile filter toggle content
function mobileFilterToggleBtn() {
  $('.catalog__mobile-filter-btn').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('catalog__mobile-filter-btn--active');
    $(this).siblings('.sidebar').toggle(300);
  });
}

// Filters Content Toggle
function filterContentToggle() {
  $('.filter-top-content').click(function (e) {
    e.preventDefault();
    $(this).parent().find('.filter-content').toggle(300);
    $(this).toggleClass('filter-top-content--hide');
  });
}

// Filters reset btn
function filterResetBtn() {
  $('.reset-btn').click(function (e) {
    const priceSlider = document.querySelector('.price-filter__range');
    e.preventDefault();
    $(this).parent().find('.checkbox-filter__input').prop('checked', false);
    priceSlider.noUiSlider.reset();
  });
}

// Animation Init
function aosAnimationInit() {
  // Animation on scroll
  const anim = new AnimationOnScroll({
    jsonUrl: '/js/animations.json',
    aosOptions: {
      offset: 50,
      duration: 500,
      once: true,
    },
  });

  // Init animations
  anim.init();
}

// localStorage getItem
function getItem(key) {
  return localStorage.getItem(key);
}

// localStorage setItem
function setItem(key, value) {
  return localStorage.setItem(key, value);
}

// bradcrumbs popup
function catalogProductBreadCrumbs() {
  let currentIndex = getItem('itemDataIndex');
  const item = $('.product-catalog__row .product-catalog__col');
  const activeItem = $('.product-catalog__top-content');
  let isOpenActivePopup = false;

  const getCurrentItemContent = i => {
    return $(`.product-catalog__col[data-index=${i}]`).html();
  };

  const setCategory = () => {
    return $(`.product-catalog__col[data-index=${currentIndex}]`).find('input').prop('checked', true);
  };

  const getActiveWidth = () => {
    $('.product-catalog--popup').width(activeItem.outerWidth() + 25);
  };

  const closePopup = thisPopup => {
    thisPopup.closest('.product-catalog--popup').removeClass('product-catalog--active');
    thisPopup.closest('.product-catalog__popup-content').hide(300);
  };

  const toggleActivePopup = thisPopup => {
    isOpenActivePopup = !isOpenActivePopup;
    thisPopup.closest('.product-catalog--popup').toggleClass('product-catalog--active');
    thisPopup.parent().siblings('.product-catalog__popup-content').toggle(300);
  };

  if (currentIndex !== null) {
    activeItem.html(getCurrentItemContent(currentIndex));
    setCategory();
  }

  $('.catalog .product-catalog__item').click(function (e) {
    e.preventDefault();
  });

  item.click(function () {
    const thisIndex = $(this).attr('data-index');
    const isCurrent = currentIndex === thisIndex;

    if (!isCurrent) {
      $(this).closest('.product-catalog__wrap').find(activeItem).html(getCurrentItemContent(thisIndex));
      // setItem('itemDataIndex', thisIndex);
      currentIndex = thisIndex;
      setCategory();
    }
    getActiveWidth();
    closePopup($(this));

    window.location.href = $(this).attr('data-url');

    // $(this).closest('form').trigger('change');
  });

  getActiveWidth();

  activeItem.click(function (e) {
    e.preventDefault();
    e.stopPropagation();

    toggleActivePopup($(this));
  });

  window.addEventListener('click', function (e) {
    if (isOpenActivePopup) {
      toggleActivePopup(activeItem);
    }
  });
}

// calculate product price
function productPriceCalculate() {
  const input = $('.cart-list .product-counter__input');

  function calculatePrice(element) {
    /*const thisInput = +(element.closest('.cart-list__item').find('.cart-list__item-price-value').text());
    const total = thisInput * element.val();
    const str = String(total).replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
    element.closest('.cart-list__item').find('.cart-list__item-total-price-value').text(str);*/
    var qty = parseInt(element.val()),
      id = element.attr('data-id'),
      cartItem = element.closest('.cart-list__item'),
      maxQty = parseInt(element.attr('max'));

    if (qty > maxQty) {
      qty = maxQty;
      element.val(qty);
    }

    $.post(
      '/cart/change-qty',
      { id: id, qty: qty },
      function (resp) {
        if (resp.itemPrice != undefined && resp.itemCost != undefined && resp.totalCost != undefined) {
          updateElement(cartItem.find('.cart-list__item-price-value'), resp.itemPrice);
          updateElement(cartItem.find('.cart-list__item-total-price-value'), resp.itemCost);
          updateElement($('.cart__total-price-cost'), resp.totalCost);
        } else {
          $.growl.error({
            title: '',
            message: resp.error,
            size: 'large',
          });
        }
      },
      'json',
    );
  }

  input.on('change', function () {
    calculatePrice($(this));
  });

  $('.cart-list .product-counter__minus, .cart-list .product-counter__plus').click(function (e) {
    e.preventDefault();
    const thisInput = $(this).siblings('.input-wrap').find('input');
    calculatePrice(thisInput);
  });
}

// shippingSwitcher
function shippingSwitcher() {
  const checkbox = $('.shipping-item__input');
  $('.shipping-item__input:checked').parent().addClass('shipping-item--active');
  checkbox.change(function () {
    checkbox.parent().removeClass('shipping-item--active');
    checkbox.prop('checked', false);
    $(this).parent().addClass('shipping-item--active');
    $(this).prop('checked', true);

    if ($('#registerform-delivery_id').length) {
      $('#registerform-delivery_id').val($(this).val());
    }
  });
}

// singleProductSlider
function singleProductSlider() {
  const sliderSettings = {
    loop: false,
    items: 1,
    margin: 0,
    nav: false,
    dots: true,
    dotsEach: 1,
    autoHeight: true,
    animateOut: 'fadeOut',
    onInitialized: function (event) {
      const slider = $(event.target);
      const dots = slider.find('.owl-dot span');
      const sliderItems = slider.find('.owl-item');
      const sliderItem = sliderItems.find('.product-single-slider__item');

      for (let i = 0; i < sliderItem.length; i++) {
        MQ(
          minMd,
          function () {
            dots.eq(i).html(sliderItem.eq(i).html());
            slider.trigger('refresh.owl.carousel');
          },
          function () {
            dots.eq(i).html('');
            slider.trigger('refresh.owl.carousel');
          },
        );
      }
      fancyBox();
    },
  };

  $('.product-single-slider .owl-carousel').owlCarousel(sliderSettings);
}

$('.product-table__delete-btn').click(function (e) {
  e.preventDefault();
  // your code...
});

// fancyBox init
function fancyBox() {
  const group = $('[data-fancybox="gallery"]');
  const options = {
    buttons: ['zoom', 'thumbs', 'close'],
    protect: true,
    afterShow: function () {
      const idx = $.fancybox.getInstance().currIndex;
      console.log($.fancybox.getInstance());
      $('.product-single-slider').trigger('to.owl.carousel', [idx]);
    },
  };

  group.fancybox(options);
}

// color filter add active class
function activeColorFilter() {
  const filterLink = $('.color-filter__link');
  const activeItem = () => {
    $(`.color-filter__link[href="${getItem('linkHref')}"]`).addClass('color-filter__link--active');
  };

  activeItem();
  filterLink.click(function () {
    filterLink.removeClass('color-filter__link--active');
    // setItem('linkHref', $(this).attr('href'));
    activeItem();
  });
}

// On load functions
$(window).on('load', function () {
  productHeightSwitcher();
  smoothScroll();
});

// On resize functions
$(window).on('resize', function () {
  productHeightSwitcher();
  $('.product-catalog__row--mobile-slider').trigger('refresh.owl.carousel');
});

// On scroll functions
$(window).scroll(function () {
  fixElements();
});

/////////// mfp popup - https://dimsemenov.com/plugins/magnific-popup/
const mfpPopup = function (popupID, source) {
  $.magnificPopup.open({
    items: {
      src: popupID,
    },
    type: 'inline',
    fixedContentPos: false,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    closeMarkup: '<button type="button" class="mfp-close">&times;</button>',
    mainClass: 'mfp-fade-zoom',
    // callbacks: {
    // 	open: function() {
    // 		$('.source').val(source);
    // 	}
    // }
  });
};

// Vanilla js functions
// noUiSlider - https://refreshless.com/nouislider/

const initTabs = (link, item, parent) => {
  const tabLink = $(`.${link}`);
  const tabContentItem = $(`.${item}`);

  tabContentItem.not(tabContentItem.first()).hide();
  tabLink.first().addClass(`${link}--active`);

  tabLink.on('click', e => {
    e.preventDefault();
    const currentElement = $(e.currentTarget);
    const id = currentElement.attr('href').replace('#', '');
    const currentTabContentItem = $(`.${item}[data-id='${id}']`);

    currentElement.closest(`.${parent}`).find(`.${link}`).removeClass(`${link}--active`);
    console.log(currentElement.closest(`.${parent}`).find(`.${link}`));
    currentElement.addClass(`${link}--active`);

    tabContentItem.not(currentTabContentItem).fadeOut(0);
    currentTabContentItem.fadeIn(500);
  });
};

// const changeCartFormContent = () => {
//   // const cartParent = $('.cart__form');
//   const cartTabsLink = $('.cart-tabs__link');
//   // const cartTabsParent = $('.cart-tabs__content');
//   const cartTabContentItem = $('.cart-tabs__content-item');

//   cartTabContentItem.not(cartTabContentItem.first()).hide();

//   cartTabsLink.on('click', e => {
//     e.preventDefault();
//     const currentElement = $(e.currentTarget);
//     const id = currentElement.attr('href').replace('#', '');
//     const currentCartTabContentItem = $(`.cart-tabs__content-item[data-id='${id}']`);

//     currentElement.closest('.cart-tabs__list').find('.cart-tabs__link').removeClass('.cart-tabs__link--active');

//     // cartTabsParent.append(currentCartTabContentItem);
//     // currentCartTabContentItem.removeClass('d-none');

//     cartParent.after(cartTabContentItem.not(currentCartTabContentItem));
//     cartTabContentItem.not(currentCartTabContentItem).addClass('d-none');
//   });
// };

const switchActiveStateBtnCart = () => {
  const cartTabsLink = $('.cart-tabs__link');

  cartTabsLink.first().addClass('cart-tabs__link--active');

  cartTabsLink.on('click', function (e) {
    e.preventDefault();
    cartTabsLink.not(this).removeClass('cart-tabs__link--active');
    $(this).addClass('cart-tabs__link--active');
  });
};

function formAppearence() {
  const feedbacksBtn = $('.feedbacks__btn');
  const feedbacksForm = $('.feedbacks-form');

  if (feedbacksForm && $('.feedbacks__item').length > 0) {
    feedbacksForm.fadeOut();
  } else {
    feedbacksBtn.hide();
  }

  feedbacksBtn.on('click', function () {
    $(this).hide();
    feedbacksForm.fadeIn(500);
  });
}

formAppearence();

const multiSelect = () => {
  const selects = document.querySelectorAll('.js-choice');

  selects.forEach(item => {
    new Choices(item, {
      searchEnabled: false,
      resetScrollPosition: false,
      itemSelectText: '',
      allowHTML: false,
      classNames: {
        flippedState: '',
      },
    });
  });
};

function addNewAddress() {
  const buttonAddNewAddress = $('.add-new');
  const newBlock = $('.address-new');
  const cancelBtn = $('#hide-address');

  newBlock.fadeOut();

  buttonAddNewAddress.on('click', function (e) {
    e.preventDefault();
    $(this).attr('disabled', 'disbaled');
    newBlock.fadeIn(300);
  });

  cancelBtn.on('click', function (e) {
    e.preventDefault();
    newBlock.fadeOut();
    buttonAddNewAddress.removeAttr('disabled');
  });
}

const toggleHideUnecessaryItems = () => {
  const benefitList = $('.product-single__benefit-item ul');

  benefitList.each(function () {
    const benefitItem = $(this).find('li');

    if (benefitItem.length > 6) {
      benefitItem.slice(6).hide();
    }

    if (benefitItem.length <= 6) {
      $(this).next('button').hide();
    } else {
      $(this).next('button').show();
    }

    $(this)
      .next('button')
      .on('click', function () {
        if (benefitItem.length > 6) {
          benefitItem.slice(6).slideToggle(300);
        }
      });
  });
};

$(document).ready(function () {
  multiSelect();
  initTabs('tabs-nav__link', 'tabs-content__item', 'tabs-nav__list');
  initTabs('cart-tabs__link', 'cart-tabs__content-item', 'cart-tabs__list');
  addNewAddress();
  toggleHideUnecessaryItems();
  switchActiveStateBtnCart();
});
