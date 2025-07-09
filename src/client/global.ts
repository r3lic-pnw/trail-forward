document.getElementById('menu-icon')!.addEventListener('click', () => {
    const nav = document.getElementById('main-nav')! as HTMLElement;
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
});