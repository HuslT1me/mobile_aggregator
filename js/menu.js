const buttonToggleMenu = document.querySelector('.hamburger');
console.log(buttonToggleMenu);
const rootMenuElement = document.querySelector('.root-nav');
const buttonArrowBack = Array(rootMenuElement.querySelectorAll('.arrow-back'));
let offset = 0;

rootMenuElement.addEventListener('click', (evt) => {
  if(evt.target.closest('.arrow-back')) {
    offset += 100;
    rootMenuElement.setAttribute('style', `transform: translateX(${offset}%)`);
    closeAllSubMenu(evt.target.nextElementSibling);
    evt.target.closest('ul').classList.remove('sub-menu-active');
  }
  if (evt.target.nodeName !== 'SPAN') return;
  closeAllSubMenu(evt.target.nextElementSibling);
  if(!evt.target.nextElementSibling.classList.contains('sub-menu-active-span')) {
    offset -= 100;
    rootMenuElement.setAttribute('style', `transform: translateX(${offset}%)`);
    evt.target.classList.add('sub-menu-active-span');
    evt.target.nextElementSibling.classList.add('sub-menu-active');
  } else {
    rootMenuElement.setAttribute('style', `transform: translateX(${offset}%)`);
    evt.target.classList.remove('sub-menu-active-span');
    evt.target.nextElementSibling.classList.remove('sub-menu-active');
  }
});

function closeAllSubMenu(current = null) {
  let parents = [];
  if(current)  {
    let currentParent = current.parentNode;
    while(currentParent) {
      if(currentParent.classList.contains('root-nav')) break;
      if(currentParent.nodeName === "UL") parents.push(currentParent);
      currentParent = currentParent.parentNode;
    }
  }
  const subMenu = Array.from(document.querySelectorAll('.root-nav ul'));
  subMenu.forEach((item) => {
    if (item != current && !parents.includes(item)) {
      item.classList.remove('sub-menu-active');
      if(item.previousElementSibling.nodeName === "SPAN"){
        item.previousElementSibling.classList.remove('sub-menu-active-span');
      }
    }
  });
};

buttonToggleMenu.addEventListener('click', () => {
  closeAllSubMenu();
  offset = 0;
  rootMenuElement.setAttribute('style', `transform: translateX(${offset}%)`);
});