const newModal=document.getElementById('modalTutorial');
const modalInstanceModal=new bootstrap.Modal(newModal);
const contenedor=document.querySelector('.container-fluid');
const btnSiguiente=document.getElementById('btnSiguiente');
const btnAnterior=document.getElementById('btnAnterior');
const btnFin=document.getElementById('btnFin');
const btnConfirm=document.getElementById('btnConfirm');
const tutorial = [
    {
        imagen: '',
        titulo: 'Bienvenido a MataNotas',
        texto: 'MataNotas es una app que te permite crear notas y organizar tus ideas y recordatorios de una forma fácil y divertida.',
    },
    {
        imagen: '',
        titulo: 'Agregar Nota',
        texto: 'Para agregar una nota, simplemente pulsa el botón de "+" en la parte inferior. Añade un título y el contenido de tu nota y ¡listo!',
    },
    {
        imagen: '',
        titulo: 'Agregar Fondo de Pantalla',
        texto: 'Para agregar un fondo de pantalla, pulsa el botón de configuración en la parte superior y selecciona "Agregar imagen de fondo". Puedes elegir una foto de tu galería o tomar una en ese momento.',
    },
    {
        imagen: '',
        titulo: 'Quitar Fondo de Pantalla',
        texto: 'Si ya no te gusta el fondo de pantalla, puedes quitarlo haciendo clic en el botón de configuración y luego seleccionando "Quitar Fondo".',
    },
    {
        imagen: '',
        titulo: 'Búsqueda',
        texto: 'En la parte superior encontrarás una barra de búsqueda donde podrás buscar las notas por su título.',
    },
    {
        imagen: '',
        titulo: 'Disfrútala',
        texto: 'Ya tienes los pasos iniciales. El resto de la app está diseñada para ser muy intuitiva y fácil de usar. Si tienes sugerencias, estaremos encantados de escucharlas. Puedes encontrar nuestros contactos en "Configuraciones" ---> "Contáctanos".',
    },
];

var tutorialActualIndex=0;

function confirmar(){
    const confirmacion=localStorage.getItem('confirmacion');
    if(confirmacion!=='true'){
        modalInstanceModal.show();
    }else{
        btnConfirm.checked=true;
        contenedor.classList.remove('filtro');
    }
}

newModal.addEventListener('show.bs.modal',()=>{
    imgFondo.src='';
    contenedor.classList.add('filtro');
    tutorialActualIndex=0;
    mostrarTutorial();
})

newModal.addEventListener('hidden.bs.modal',()=>{
    contenedor.classList.remove('filtro');
});

function mostrarTutorial(){
    const tutorialActual=tutorial[tutorialActualIndex];

    document.getElementById('tutorialTitulo').textContent=tutorialActual.titulo;
    document.getElementById('tutorialContenido').textContent=tutorialActual.texto;
    if(tutorialActual.imagen!==''){
        document.getElementById('tutorialImagen').src=tutorialActual.imagen;
    }

    if(tutorialActualIndex===tutorial.length-1){
        btnSiguiente.classList.add('d-none');
        btnFin.classList.remove('d-none');
    }else{
        btnSiguiente.classList.remove('d-none');
        btnFin.classList.add('d-none');
    }

    if(tutorialActualIndex===0){
        btnAnterior.classList.add('d-none');
    }else{

        btnAnterior.classList.remove('d-none');
    }
}

btnSiguiente.addEventListener('click',()=>{
    tutorialActualIndex++;
    mostrarTutorial();
});
btnAnterior.addEventListener('click',()=>{
    tutorialActualIndex--;
    mostrarTutorial();
});
btnFin.addEventListener('click',()=>{
    modalInstanceModal.hide();
    buscarFoto();
});

btnConfirm.addEventListener('change',()=>{
    if(btnConfirm.checked){
        localStorage.setItem('confirmacion', true);
    }else{
        localStorage.setItem('confirmacion', false);
    }
});


mostrarTutorial();
confirmar();