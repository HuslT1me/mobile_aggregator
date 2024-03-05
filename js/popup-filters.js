const popupTypeFilter = document.querySelector(".popup-filter");
const popupCloseBtn = popupTypeFilter.querySelector(".popup-filter__close-button");
const categoryLinksList = Array.from(document.querySelectorAll(".catalog__category-link"));

popupCloseBtn.addEventListener("click", closePopup);

function checkPopupIsOpen() {
   return document.querySelector('.popup-filter.is-open') ?  true : false;
}

function openFilterPopup(evt) {
  evt.stopPropagation();
  const isOpen = checkPopupIsOpen();
  if(isOpen) {
    closePopup();
    openPopup();
  } else {
    openPopup();
  }
}

function closePopup() {
  popupTypeFilter.classList.remove("is-open");
  console.log('close');
  window.removeEventListener("click", windowHandlerCloseFilterPopup);
} 

function openPopup() {
    console.log('is-open');
    popupTypeFilter.classList.add("is-open");
    window.addEventListener("click", windowHandlerCloseFilterPopup);
}

function windowHandlerCloseFilterPopup(evt) {
  if (!evt.target.closest(".popup-filter")) {
    closePopup();
  }
}

categoryLinksList.forEach(link => {
   link.addEventListener('click', openFilterPopup);
})
