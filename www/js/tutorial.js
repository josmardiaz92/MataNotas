const newModal=document.getElementById('modalTutorial');
const modalInstanceModal=new bootstrap.Modal(newModal);
const contenedor=document.querySelector('.container-fluid');
const btnSiguiente=document.getElementById('btnSiguiente');
const btnAnterior=document.getElementById('btnAnterior');
const btnFin=document.getElementById('btnFin');
const btnConfirm=document.getElementById('btnConfirm')
const tutorial=[
    {
        id:'t1',
        imagen:'',
        titulo:'Bienvenido a MataNotas',
        texto:'MataNotas es una app que te permite crear notas y organizar tus ideas y recordatorios de una forma facil y divertida',
    },
    {
        id:'t2',
        imagen:'',
        titulo:'Agregar Nota',
        texto:'Para agregar notas, es tan sencillo como pulsar el boton de "+" que se encuenta en la parte de abajo y luego en agregar nota. Luego solo debes agregar un titulo y el contenido de tu nota y ¡Listo!',
    },
    {
        id:'t3',
        imagen:'',
        titulo:'Agregar Fondo de Pantalla',
        texto:'Para agregar un fondo, debes pulsar el boton de "+" que se encuenta en la parte de abajo y luego en agregar imagen. Puedes elegir alguna foto de tu galeria o tomar una en ese momento.',
    },
];
var tutorialActualIndex=0;

function confirmar(){
    const confirmacion=localStorage.getItem('confirmacion');
    console.log(confirmacion)
    if(confirmacion!=='true'){
        modalInstanceModal.show();
    }else{
        contenedor.classList.remove('filtro');
    }
}

newModal.addEventListener('hidden.bs.modal', function () {
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