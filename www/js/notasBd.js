var bd;
//Llamamos todo lo que se necesita del DOM
const contenedorCartas=document.getElementById('contenedorCartas'); //contenedor donde se mostraran las notas
//modales y formularios donde se agregara la informacion
const modalAgregar=document.getElementById('modalAgregar');
const formularioAgregar=modalAgregar.querySelector('form');
const modalEditar=document.getElementById('modalEditar');
const formularioEditar=modalEditar.querySelector('form');
const modalConfiguraciones=document.getElementById('modalConfiguraciones');
//instanciaremos los modales para poder usar despues la funcion de cerrar el modal
const modalInstanceAgregar = new bootstrap.Modal(modalAgregar);
const modalInstanceEditar = new bootstrap.Modal(modalEditar);
const modalInstanceConfiguraciones = new bootstrap.Modal(modalConfiguraciones);
//aca llamamos los input que contienen la informacion a agregar o editar
const tituloAgregar=document.getElementById('tituloAgregar');
const textoAgregar=document.getElementById('textoAgregar');
const tituloEditar=document.getElementById('tituloEditar');
const textoEditar=document.getElementById('textoEditar');
const idEditar=document.getElementById('idEditar');
const inputBuscar=document.getElementById('buscar');
const contenedorAnuncios=document.getElementById('contenedorAnuncio');
const btnTomarFoto=document.getElementById('tomarFoto');
const btnQuitarFondo=document.getElementById('quitarFondo');
const imgFondo=document.querySelector('img');
var imagen='';
var ultimaBusqueda='';


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
    contarCartas();
    iniciarBd();
    escucharBtn();
    if(!document.querySelector('.container-fluid').classList.contains('filtro')){
        buscarFoto();
    }
}

    /* contarCartas();
    iniciarBd();
    escucharBtn();
    if(!document.querySelector('.container-fluid').classList.contains('filtro')){
        console.log('dadadada')
        buscarFoto();
    } */


inputBuscar.addEventListener('keypress',(evento)=>{
    if(evento.key==='Enter'){
        const busqueda=inputBuscar.value.toLowerCase();
        buscarNota(busqueda);
    }
})

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

btnTomarFoto.addEventListener('click',()=>{
    navigator.notification.confirm(
        'Por favor elija de donde desea la imagen', // message
        obtenerMedio,            // callback to invoke with index of button pressed
        'Alerta',           // title
        ['Camara','Album']     // buttonLabels
    );

    // Configura las opciones de la cámara
    /* var options = {
        quality: 50, // Calidad de la imagen (50 es media calidad)
        destinationType: Camera.DestinationType.FILE_URI, // Tipo de destino de la imagen
        sourceType: Camera.PictureSourceType.CAMERA, // Origen de la imagen (cámara o galería)
        //saveToPhotoAlbum: true, // Guarda la foto en la galería del dispositivo
        correctOrientation: true,
        encodingType: Camera.EncodingType.JPEG // Tipo de codificación de la imagen
    }; */

    // Llama a la cámara y devuelve la imagen
    /* navigator.camera.getPicture(onSuccess, onFail, options); */
});

btnQuitarFondo.addEventListener('click',()=>{
    navigator.notification.confirm(
        '¿Desea quitar el fondo?', // message
        quitarFondo,            // callback to invoke with index of button pressed
        'Alerta',           // title
        ['Si','no']     // buttonLabels
    );
})

function obtenerMedio(e){
    if(e==1){
        var medio=Camera.PictureSourceType.CAMERA;
    }else{
        var medio=Camera.PictureSourceType.PHOTOLIBRARY;
    }
    var options = {
        quality: 50, // Calidad de la imagen (50 es media calidad)
        destinationType: Camera.DestinationType.FILE_URI, // Tipo de destino de la imagen
        sourceType: medio, // Origen de la imagen (cámara o galería)
        //saveToPhotoAlbum: true, // Guarda la foto en la galería del dispositivo
        correctOrientation: true,
        encodingType: Camera.EncodingType.JPEG // Tipo de codificación de la imagen
    };
    navigator.camera.getPicture(onSuccess, onFail, options);
}

function colorRamdom() {
    const matiz = Math.floor(Math.random() * 360);
    const saturacion = Math.random() * 0.8 + 0.2;
    const ligereza = Math.random() * 0.8 + 0.2;
    return `hsl(${matiz}, ${saturacion * 100}%, ${ligereza * 100}%)`;
}
function obtenerFecha(){
    const currentDate=new Date();
    const dia=currentDate.toLocaleDateString('es-ES',{weekday:'long'});
    const formatoFecha=currentDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
    const hora=currentDate.toLocaleTimeString('es-ES',{
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24'
    });
    const fecha=`${dia} - ${formatoFecha} - ${hora}`;
    return fecha
}

function iniciarBd(){
    //escuchamos al boton agregar dentro del modarlAgregar, para que al hacer click agregue la tarjeta
    formularioAgregar.addEventListener('submit',agregar);
    var solicitud = indexedDB.open("Datos-de-Notas");

    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearAlmacen);
}

function MostrarError(evento){
    var error = evento.target.error;
    alert("Tenemos un ERROR: " + error.code + " / " + error.message);
}

function Comenzar(evento){
    bd = evento.target.result;
    Mostrar();
}

function CrearAlmacen(evento){
    var baseDeDatos = evento.target.result;
    var almacen = baseDeDatos.createObjectStore("Notas", {keyPath: "id"});
    almacen.createIndex("BuscarNota", "Titulo", {unique: false});
    almacen.createIndex("BuscarNotaPorFecha", "Fecha", {unique:false});
}

function agregar(evento){
    evento.preventDefault();
    obtenerIdMasAlto().then(idMasAlto => {
        var titulo=tituloAgregar.value.toLowerCase();
        var contenido=textoAgregar.value;
        var id = idMasAlto+1;
        id=String(id);
        var color=colorRamdom();
        var fecha=obtenerFecha();

        var transaccion = bd.transaction(["Notas"], "readwrite");
        var almacen = transaccion.objectStore("Notas");
        transaccion.addEventListener("complete", Mostrar)

        almacen.add({
            id: id,
            Titulo: titulo,
            Contenido: contenido,
            Color: color,
            Fecha: fecha
        });
    });
    modalInstanceAgregar.hide();
}

function Mostrar(){

    obtenerNotas().then(notas => {
        notas.sort((a, b) => a.Titulo.localeCompare(b.Titulo));
        MostrarNotas(notas);
    });
}

function MostrarNotas(evento){
    contenedorAnuncios.innerHTML=``;
    contenedorCartas.innerHTML=``;
    contenedorCartas.classList.add('row-cols-2');
    evento.forEach(nota => {
        contenedorCartas.innerHTML += `<div class="col colBorrar">
                                        <div class="card sin-scroll" style="background-color: ${nota.Color}" id="${nota.id}">
                                            <div class="opacity-50 d-none contenedorBorrar row me-1 mt-1 d-flex align-items-center">
                                                <div class="col-2">
                                                    <button type="button" class="atras ms-3" title="Atras">
                                                        <i class="fa-solid fa-arrow-left" style="color: #080808;"></i>
                                                    </button>
                                                </div>
                                                <div class="col-8 d-flex justify-content-center">
                                                    <span>
                                                        ${nota.Fecha}
                                                    </span>
                                                </div>
                                                <div class="col-1 d-flex justify-content-center m-0 p-0">
                                                    <button type="button" class="editar" data-bs-toggle="modal" data-bs-target="#modalEditar" title="Editar">
                                                        <i class="fa-solid fa-pen-to-square editar" style="color: #000000;">
                                                    </i></button>
                                                </div>
                                                <div class="col-1 d-flex justify-content-center m-0 p-0">
                                                    <button type="button" class="btn-close btnBorrar me-1" title="Eliminar"></button>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <h5 class="card-title">${nota.Titulo}</h5>
                                                <p class="card-text">${nota.Contenido}</p>
                                            </div>
                                        </div>
                                    </div>`;
    });

    contarCartas();
}

async function obtenerNotas() {
    return new Promise((resolve, reject) => {
        const transaccion = bd.transaction("Notas");
        const almacen = transaccion.objectStore("Notas");
        const puntero = almacen.openCursor();
    
        const notas = [];
    
        puntero.addEventListener("success", () => {
            const punteroActual = puntero.result;
            if (punteroActual) {
                notas.push(punteroActual.value);
                punteroActual.continue();
            } else {
                resolve(notas);
            }
        });
    });
}

async function obtenerIdMasAlto() {
    const notas = await obtenerNotas();
    const idMasAlto = notas.reduce((maxId, nota) => {
        return Math.max(maxId, nota.id);
    }, 0);
    return idMasAlto;
}

function seleccionarNota(evento){
    if(evento.target.classList.contains('editar')){
        const carta=evento.target.closest('.card');
        editarCarta(carta);
    }
}

function editarCarta(carta){
    const titulo=carta.querySelector('.card-title').textContent;
    const texto=carta.querySelector('.card-text').textContent;
    idEditar.value=carta.id
    tituloEditar.value=titulo;
    textoEditar.value=texto;
    var fecha=obtenerFecha();
    formularioEditar.addEventListener('submit',(e)=>{
        e.preventDefault();
        const cartaID = idEditar.value;
        var transaccion = bd.transaction(["Notas"], "readwrite");
        var almacen = transaccion.objectStore("Notas");
        transaccion.addEventListener("complete", Mostrar);
        almacen.put({
            id: cartaID,
            Titulo: tituloEditar.value,
            Contenido: textoEditar.value,
            Color: carta.style.backgroundColor,
            Fecha: fecha
        });
        
        modalInstanceEditar.hide();
    })
}

function eliminarNota(evento){
    if(evento.target.classList.contains('btnBorrar')) {
        navigator.notification.confirm(
            '¿Desea borrar la nota?', // message
            (e)=>{
                if(e===1){
                    const carta=evento.target.closest('.card');
                    const cartaID=carta.id;
                    var transaccion=bd.transaction(["Notas"], "readwrite");
                    var almacen=transaccion.objectStore("Notas");
                    transaccion.addEventListener("complete", Mostrar);
                
                    var solicitud=almacen.delete(cartaID);
                }
            },            // callback to invoke with index of button pressed
            'Alerta',           // title
            ['Si','no']     // buttonLabels
        );
        /* const carta=evento.target.closest('.card');
        const cartaID=carta.id;
        var transaccion=bd.transaction(["Notas"], "readwrite");
        var almacen=transaccion.objectStore("Notas");
        transaccion.addEventListener("complete", Mostrar);
    
        var solicitud=almacen.delete(cartaID); */
    }
}

function buscarNota(busqueda){

    var buscar=busqueda;
    ultimaBusqueda=buscar;

    contenedorAnuncios.innerHTML=`<div class="col-12 d-flex justify-content-center mt-3" data-bs-theme="dark">
                                    <button type="button" class="me-1 rounded-circle border p-2 btn-close" id="btnCancelarBusqueda"></button>
                                </div>`
    contenedorCartas.innerHTML=``;
    const busquedaExtricta=/^"/.test(buscar) && /"$/.test(buscar);
    const busquedaPorFecha=/^#/.test(buscar);
    var transaccion = bd.transaction(["Notas"]);
    var almacen = transaccion.objectStore("Notas");

    if(busquedaPorFecha){
        var indice=almacen.index('BuscarNotaPorFecha');
        buscar=buscar.slice(1)
        var rango=IDBKeyRange.bound(buscar, buscar + "\uFFFF");
    }else{
        var indice=almacen.index('BuscarNota');
        if(busquedaExtricta || buscar==''){
            buscar=buscar.slice(1, -1);
            var rango=IDBKeyRange.only(buscar);
        }else{
            var rango = IDBKeyRange.bound(buscar, buscar + "\uffff");
        }
    }

    

    var puntero=indice.openCursor(rango);
    puntero.addEventListener('success',mostrarBusqueda);
}

function mostrarBusqueda(evento){
    var puntero = evento.target.result;
    contenedorCartas.classList.add('row-cols-2');
    if(puntero){
        contenedorCartas.innerHTML+=`<div class="col colBorrar">
                                        <div class="card sin-scroll" style="background-color: ${puntero.value.Color}" id="${puntero.value.id}">
                                            <div class="opacity-50 d-none contenedorBorrar row me-1 mt-1 d-flex align-items-center">
                                                <div class="col-2">
                                                    <button type="button" class="atras" ms-3" title="Atras">
                                                        <i class="fa-solid fa-arrow-left" style="color: #080808;"></i>
                                                    </button>
                                                </div>
                                                <div class="col-8 d-flex justify-content-center">
                                                    <span>
                                                        ${puntero.value.Fecha}
                                                    </span>
                                                </div>
                                                <div class="col-1 d-flex justify-content-center m-0 p-0">
                                                    <button type="button" class="editar" data-bs-toggle="modal" data-bs-target="#modalEditar">
                                                        <i class="fa-solid fa-pen-to-square editar" style="color: #000000;">
                                                    </i></button>
                                                </div>
                                                <div class="col-1 d-flex justify-content-center m-0 p-0">
                                                    <button type="button" class="btn-close btnBorrar me-1"></button>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <h5 class="card-title ">${puntero.value.Titulo}</h5>
                                                <p class="card-text">${puntero.value.Contenido}</p>
                                            </div>
                                        </div>
                                    </div>`;
        puntero.continue();
    }else if(c=contenedorCartas.querySelectorAll('.card').length<=0){
        contenedorAnuncios.innerHTML+=`<div class="col-12 d-flex justify-content-center">
                                        <h1 class="text-center opacity-50">
                                            Sin Resultados
                                        </h1>
                                    </div>`
    }
    document.getElementById('buscar').value='';
    contarCartas();
    document.getElementById('btnCancelarBusqueda').addEventListener('click',Mostrar);
}



function escucharBtn(){
    document.addEventListener("backbutton", ()=>{
        const cartaSeleccionada=document.querySelector('.expandida',null);
        const quitarBusqueda=document.getElementById('btnCancelarBusqueda',null);

        if(cartaSeleccionada){
            if(quitarBusqueda){
                buscarNota(ultimaBusqueda)
            }else{
                Mostrar();
            }
            /* const cb=cartaSeleccionada.querySelector('.contenedorBorrar');
            cb.classList.add('d-none');
            cartaSeleccionada.classList.remove('expandida');
            contenedorCartas.classList.add('row-cols-2','row-cols-md-4');
            contarCartas() */
        }else if(quitarBusqueda){
            Mostrar();
        }else{
            navigator.app.exitApp();
        }
        
    });
    contenedorCartas.addEventListener('click',(evento)=>{
        if (evento.target.classList.contains('btnBorrar')) {
            eliminarNota(evento);
        } else if (evento.target.classList.contains('editar')) {
            seleccionarNota(evento);
        }
    });
}

function contarCartas(){
    const cartas=contenedorCartas.querySelectorAll('.card');
    cartas.forEach(carta=>{
        const contenedorBorrar=carta.querySelector('.contenedorBorrar');
        const btnAtras=carta.querySelector('.atras');
        //escuchamos si el mouse esta encima de la nota
        carta.addEventListener('mouseover',()=>{
            //al pasar por la nota, se muestra el contenedor del boton borra y editar
            contenedorBorrar.classList.remove('d-none');
            carta.classList.add('expandida');
            contenedorCartas.classList.remove('row-cols-2','row-cols-md-4');
        });
        /* carta.addEventListener('mouseout',()=>{
            //al salir de la nota, se vuelve a ocultar el contenedor de los botonos borrar y editar
            contenedorBorrar.classList.add('d-none');
            carta.classList.remove('expandida');
            contenedorCartas.classList.add('row-cols-2','row-cols-md-4');
        }); */
        btnAtras.addEventListener('click',()=>{
            //al salir de la nota, se vuelve a ocultar el contenedor de los botonos borrar y editar
            contenedorBorrar.classList.add('d-none');
            carta.classList.remove('expandida');
            contenedorCartas.classList.add('row-cols-2','row-cols-md-4');
        });
    })
}


// Función ejecutada cuando se toma una foto exitosamente
function onSuccess(imageData) {
    const win = function (fileEntry) {
        im = fileEntry.toURL();

        ponerFoto();
    };

    const fail = function (error) {
        console.error("Error al guardar el archivo: ", error);
    };

    // Convierte la URL de la imagen a un objeto FileEntry
    window.resolveLocalFileSystemURL(imageData, win, fail);
}

// Función ejecutada cuando falla la captura de la imagen
function onFail(message) {
    alert('Error al tomar la foto: ' + message);
}

function ponerFoto() {
    imagen=im;
    guardar();
    mostrarFoto(imagen);
    modalInstanceConfiguraciones.hide();
}

function guardar(){
    let imagenGuardar=imagen;
    localStorage.setItem('imagen', imagenGuardar);
}

function mostrarFoto(imagen){
    imgFondo.src=`${imagen}`
    btnQuitarFondo.classList.remove('d-none');
}

function buscarFoto(){
    let imagenBuscada=localStorage.getItem('imagen');
    if(imagenBuscada!=null && imagenBuscada!=undefined){
        imagen=imagenBuscada;
        mostrarFoto(imagen);
    }
}

function quitarFondo(e){
    if(e===1){
        imgFondo.src='';
        btnQuitarFondo.classList.add('d-none');
        localStorage.removeItem('imagen');
        modalInstanceConfiguraciones.hide();
    }
}


