//Llamamos todo lo que se necesita del DOM
const contenedorCartas=document.getElementById('contenedorCartas'); //contenedor donde se mostraran las notas
//modales y formularios donde se agregara la informacion
const modalAgregar=document.getElementById('modalAgregar');
const formularioAgregar=modalAgregar.querySelector('form');
const modalEditar=document.getElementById('modalEditar');
const formularioEditar=modalEditar.querySelector('form');
//instanciaremos los modales para poder usar despues la funcion de cerrar el modal
const modalInstanceAgregar = new bootstrap.Modal(modalAgregar);
const modalInstanceEditar = new bootstrap.Modal(modalEditar);
//aca llamamos los input que contienen la informacion a agregar o editar
const tituloAgregar=document.getElementById('tituloAgregar');
const textoAgregar=document.getElementById('textoAgregar');
const tituloEditar=document.getElementById('tituloEditar');
const textoEditar=document.getElementById('textoEditar');

//escuchamos al modal agregar, para que cuando se cierre, limpie los inputs
modalAgregar.addEventListener('hidden.bs.modal', ()=>{
    tituloAgregar.value = '';
    textoAgregar.value = '';
});
//escuchamos al modal editar, para que cuando se cierre, limpie los inputs
modalEditar.addEventListener('hidden.bs.modal', ()=>{
    tituloEditar.value = '';
    textoEditar.value = '';
});

//escuchamos al boton agregar dentro del modarlAgregar, para que al hacer click agregue la tarjeta
formularioAgregar.addEventListener('submit',agregar);

//escuchamos a los botones borrar y editar dentro de las notas, para que al hacer click borren y editen respectivamente
contenedorCartas.addEventListener('click',(evento)=>{
    if (evento.target.classList.contains('btnBorrar')) {
        borrar(evento);
    } else if (evento.target.classList.contains('editar')) {
        editar(evento);
    }
});

contarCartas();

//funcion para preparar la edicion de las notas
function editar(evento){
    //pasado el evento de cuando se dio click en el boton editar, buscamos dentro del mismo si existe un elemento con la clase editar
    if(evento.target.classList.contains('editar')){ //evento.target: Esto se refiere al elemento específico en el que se hizo clic dentro del contenedor. Podría ser el propio botón, el icono dentro del botón o cualquier otro elemento dentro de la tarjeta.
        let carta=evento.target.closest('.card'); //Esta parte utiliza el closest()método proporcionado por el DOM. Comienza evento.targety recorre la jerarquía principal, buscando el elemento ancestro más cercano que coincida con la clase card.
        //tomamos el titulo y el contenido de la nota y lo colocamos en el modal que acabamos de abrir
        tituloEditar.value=carta.querySelector('.card-title').textContent;
        textoEditar.value=carta.querySelector('.card-text').textContent;
        editarCarta(carta); //pasamos la carta seleccionada y sobre la cual se va a editar el contenido
    }
}

//funcion que recoge los datos de los inputs en el modal y edita la nota
function editarCarta(carta){
    //escuchamos al boton editar o mas bien al formulario para saber en que momento se hace el submit
    formularioEditar.addEventListener('submit',(e)=>{
        e.preventDefault(); //se detiene el submit para poder usar la informacion
        //tomamos los datos de los inputs y los colocamos en la nota
        const nuevoTitulo=carta.querySelector('.card-title');
        nuevoTitulo.textContent=tituloEditar.value;
        const nuevoTexto=carta.querySelector('.card-text');
        nuevoTexto.textContent=textoEditar.value;
        //usamos la instancia que hicimos arriba y mandamos a cerrar el modal
        modalInstanceEditar.hide();
    })
}

//funcion para borrar las notas
function borrar(evento){
    //pasado el evento de cuando se dio click en el boton borrar, buscamos dentro del mismo si existe un elemento con la clase borrar
    if(evento.target.classList.contains('btnBorrar')) {//evento.target: Esto se refiere al elemento específico en el que se hizo clic dentro del contenedor. Podría ser el propio botón, el icono dentro del botón o cualquier otro elemento dentro de la tarjeta.
        const cartaBorrar=evento.target.closest('.card');//Esta parte utiliza el closest() método proporcionado por el DOM. Comienza evento.targety recorre la jerarquía principal, buscando el elemento ancestro más cercano que coincida con la clase card.
        const colBorrar=evento.target.closest('.colBorrar');//Esta parte utiliza el closest() método proporcionado por el DOM. Comienza evento.targety recorre la jerarquía principal, buscando el elemento ancestro más cercano que coincida con la clase card.
        cartaBorrar.parentNode.removeChild(cartaBorrar);//quitamos este elemento del DOM
        colBorrar.parentNode.removeChild(colBorrar);//quitamos este elemento del DOM
    }
}

//funcion que cuenta todas las .card, las recorre y escucha si el mouse le pasa por encima o no
function contarCartas(){
    const cartas=contenedorCartas.querySelectorAll('.card');
    cartas.forEach(carta=>{
        const contenedorBorrar=carta.querySelector('.contenedorBorrar');
        //escuchamos si el mouse esta encima de la nota
        carta.addEventListener('mouseover',()=>{
            //al pasar por la nota, se muestra el contenedor del boton borra y editar
            contenedorBorrar.classList.remove('d-none');
        });
        carta.addEventListener('mouseout',()=>{
            //al salir de la nota, se vuelve a ocultar el contenedor de los botonos borrar y editar
            contenedorBorrar.classList.add('d-none');
        });
    })
}

//funcion para crear un color aleatorio para las notas
function colorRamdom() {
    const matiz = Math.floor(Math.random() * 360);
    const saturacion = Math.random() * 0.8 + 0.2;
    const ligereza = Math.random() * 0.8 + 0.2;
    return `hsl(${matiz}, ${saturacion * 100}%, ${ligereza * 100}%)`;
}

//funcion para agregar una nueva nota
function agregar(evento){
    evento.preventDefault(); //se detiene el submit para poder usar la informacion
    //tomamos los datos de los inputs y los colocamos en la nota
    const color=colorRamdom();
    contenedorCartas.innerHTML+=`<div class="col colBorrar" >
                                    <div class="card" style="background-color: ${color}">
                                        <div class="opacity-50 d-none contenedorBorrar row row-cols-1">
                                            <div class="col d-flex justify-content-end">
                                                <button type="button" class="btn-close btnBorrar me-1"></button>
                                            </div>
                                            <div class="col d-flex justify-content-end">
                                                <button type="button" class="editar" data-bs-toggle="modal" data-bs-target="#modalEditar">
                                                    <i class="fa-solid fa-pen-to-square editar" style="color: #000000;">
                                                </i></button>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <h5 class="card-title">${tituloAgregar.value}</h5>
                                            <p class="card-text">${textoAgregar.value}</p>
                                        </div>
                                    </div>
                                </div>`;
    //usamos la instancia que hicimos arriba y mandamos a cerrar el modal
    modalInstanceAgregar.hide();
    //creada una nueva nota, volvemos a usar esta funcion para volver a contar todos los .card
    contarCartas();
}

