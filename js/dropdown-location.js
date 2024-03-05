const choicesElems = Array.from(document.querySelectorAll('.choices'));
console.log(choicesElems);

choicesElems.forEach(item => {
  item.addEventListener('click', () => {
    if(!item.className.includes('is-open')){
      openSelect(item); 
      const choicesSingleItem = item.querySelector('.choices__list--single .choices__item');
      const dropList = Array.from(item.querySelectorAll('.choices__list--dropdown .choices__item'));
      dropList.forEach(el => {
        el.addEventListener('click', (evt) => {
          selectItem(evt.target, item, choicesSingleItem, dropList);
        })
      })
    } else {
      closeSelect(item);
    }
  })
});

function openSelect(item){
  item.classList.add('is-open');
  let n = "true" === item.getAttribute("aria-expanded");
  item.setAttribute("aria-expanded", !n);
  item.querySelector('.choices__list--dropdown').classList.add('is-active');
};

function closeSelect(item){
  item.classList.remove('is-open');
  let n = "true" === item.getAttribute("aria-expanded");
  item.setAttribute("aria-expanded", !n);
  item.querySelector('.choices__list--dropdown').classList.remove('is-active');
};

function selectItem(target, item, single, list){
  if(target.dataset.value !== single.dataset.value) {
    list.forEach(elem => {
      elem.classList.remove('is-selected');
      elem.classList.add('is-highlighted');
    })
    target.classList.add('is-selected');
    target.classList.remove('is-highlighted');
    single.textContent = target.textContent;
    single.dataset.value = target.dataset.value;
  }
}

window.addEventListener('click', (evt) => {
    if(!evt.target.closest('.choices')) {
      choicesElems.forEach(item => {
        closeSelect(item);
      })
    }
})