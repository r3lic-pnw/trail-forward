"use strict";
document.getElementById('menu-icon').addEventListener('click', (e) => {
    const target = e.currentTarget;
    const nav = document.getElementById('main-nav');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    target.setAttribute('aria-expanded', nav.style.display === 'block' ? 'true' : 'false');
});
document.getElementsByClassName("logo")[0].addEventListener("click", () => {
    window.location.href = '/';
});
