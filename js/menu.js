const menuProfile = document.querySelector('#profileButton');
const option = document.querySelector('.menu span')

function toogleMenu(e) {
    if (e.target.classList.contains('menuProfile')) {
        menuProfile.classList.toggle('active');
    }

    if (e.target.classList.contains('.option')) {
        option.innerHTML = e.target.textContent;
        menuProfile.classList.remove('menu__active');
    }
}

menuProfile.addEventListener('click', toogleMenu)