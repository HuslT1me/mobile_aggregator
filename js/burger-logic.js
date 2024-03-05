function menuToggle () {
	$('.js-menu').toggleClass('is-active');
	$('.bg-menu').toggleClass('active');
	$('.mobile-menu').toggleClass('opened');
}

const btns = document.querySelectorAll('.js-menu');

btns.forEach(item => {
	item.addEventListener('click', menuToggle)
})
