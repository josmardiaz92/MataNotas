const cabecera=document.getElementById('cabeza');

window.addEventListener('scroll',()=>{
    if (window.scrollY >= 50) {
        cabecera.classList.remove('border-bottom');
        cabecera.classList.remove('border-secondary');
        cabecera.classList.add('shadow-lg');
    } else {
        cabecera.classList.add('border-bottom');
        cabecera.classList.add('border-secondary');
        cabecera.classList.remove('shadow-lg');
    }
});