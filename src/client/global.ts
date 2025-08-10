document.getElementById('menu-icon')!.addEventListener('click', (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const nav = document.getElementById('main-nav')! as HTMLElement;
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    target.setAttribute('aria-expanded', nav.style.display === 'block' ? 'true' : 'false');
});

document.getElementsByClassName("logo")[0].addEventListener("click", () => {
    window.location.href = '/';
});