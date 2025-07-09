"use strict";
document.getElementById('menu-icon').addEventListener('click', () => {
    const nav = document.getElementById('main-nav');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
});
