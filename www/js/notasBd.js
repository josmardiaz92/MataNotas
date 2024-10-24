var bd;
//Llamamos todo lo que se necesita del DOM
const contenedorCartas=document.getElementById('contenedorCartas'); //contenedor donde se mostraran las notas
const contenedorAnuncios=document.getElementById('contenedorAnuncio');
//modales y formularios donde se agregara la informacion
const modalAgregar=document.getElementById('modalAgregar');
const formularioAgregar=modalAgregar.querySelector('form');
const modalEditar=document.getElementById('modalEditar');
const formularioEditar=modalEditar.querySelector('form');
const modalConfiguraciones=document.getElementById('modalConfiguraciones');
const modalContactos=document.getElementById('modalContactos');
//instanciaremos los modales para poder usar despues la funcion de cerrar el modal
const modalInstanceAgregar = new bootstrap.Modal(modalAgregar);
const modalInstanceEditar = new bootstrap.Modal(modalEditar);
const modalInstanceConfiguraciones = new bootstrap.Modal(modalConfiguraciones);
const modalInstanceContactos= new bootstrap.Modal(modalContactos);
//aca llamamos los input que contienen la informacion a agregar o editar
const tituloAgregar=document.getElementById('tituloAgregar');
const textoAgregar=document.getElementById('textoAgregar');
const tituloEditar=document.getElementById('tituloEditar');
const textoEditar=document.getElementById('textoEditar');
const idEditar=document.getElementById('idEditar');
//aca llamamos los botones que contienen la informacion a agregar o editar
const btnTomarFoto=document.getElementById('tomarFoto');
const btnQuitarFondo=document.getElementById('quitarFondo');
const imgFondo=document.querySelector('img');
var imagen='';
var notas=[];
var accion='';
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
        buscarFoto();
    } */

//escuchamos al modal agregar, para que cuando se cierre, limpie los inputs
modalAgregar.addEventListener('show.bs.modal',()=>{
    accion='cerrarModalAgregar';
});
modalAgregar.addEventListener('hidden.bs.modal', ()=>{
    tituloAgregar.value = '';
    textoAgregar.value = '';
    accion='';
});

//escuchamos al modal editar, para que cuando se cierre, limpie los inputs
modalEditar.addEventListener('show.bs.modal',()=>{
    accion='cerrarModalEditar';
});
modalEditar.addEventListener('hidden.bs.modal', ()=>{
    tituloEditar.value = '';
    textoEditar.value = '';
    accion='';
});

modalConfiguraciones.addEventListener('show.bs.modal',()=>{
    accion='cerrarModalConfiguraciones';
});
modalConfiguraciones.addEventListener('hidden.bs.modal',()=>{
    if(accion!=='volverModal'){
        accion='';
    }
});
modalContactos.addEventListener('show.bs.modal',()=>{
    accion='volverModal';
});

btnTomarFoto.addEventListener('click',()=>{
    navigator.notification.confirm(
        'Por favor elija de donde desea la imagen', // message
        obtenerMedio,            // callback to invoke with index of button pressed
        'Alerta',           // title
        ['Camara','Album']     // buttonLabels
    );
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
    switch (e) {
        case 1:
            var medio=Camera.PictureSourceType.CAMERA;
            break;
        case 2:
            var medio=Camera.PictureSourceType.PHOTOLIBRARY;
            break;
        default:
            medio='';
            break;
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
    const saturacion = Math.random() * 0.4 + 0.6;
    const ligereza = Math.random() * 0.3 + 0.7;
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
        var titulo=tituloAgregar.value;
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
    contenedorCartas.innerHTML=``;
    obtenerNotas()
        .then(notas => {
            notas.sort((a, b) => a.Titulo.localeCompare(b.Titulo));
            MostrarNotas(notas);
        });
}

function MostrarNotas(evento){
    contenedorCartas.innerHTML=``;
    contenedorAnuncios.innerHTML=``;
    contenedorCartas.classList.add('row-cols-2');
    evento.forEach(nota => {
        nota.Contenido = nota.Contenido.replace(/\n/g, '<br>');
        contenedorCartas.innerHTML += `<div class="col colBorrar">
                                        <div class="card sin-scroll" style="background-color: ${nota.Color}" id="${nota.id}">
                                            <div class="d-none contenedorBorrar row me-1 mt-1 d-flex align-items-center">
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
                                                <div class="col-1 d-flex justify-content-center mt-3 p-0">
                                                    <button type="button" class="editar" data-bs-toggle="modal" data-bs-target="#modalEditar" title="Editar">
                                                        <i class="fa-solid fa-pen-to-square editar" style="color: #000000;">
                                                    </i></button>
                                                </div>
                                                <div class="col-1 td1flex justify-content-center m-0 p-0">
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
    
        puntero.addEventListener("success", () => {

            const punteroActual = puntero.result;
            if (punteroActual) {
                notas.push(punteroActual.value);
                punteroActual.continue();
            } else {
                notas=[...new Map(notas.map(item => [item.id, item])).values()];
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
    const texto=carta.querySelector('.card-text').innerHTML.replace(/<br>/g, '\n');

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
    }
}

function escucharBtn(){
    document.addEventListener("backbutton", ()=>{
        const cartaSeleccionada=document.querySelector('.expandida',null);
        const quitarBusqueda=document.getElementById('btnCancelarBusqueda',null);

        if(accion!=='cerrarModalConfiguraciones' && accion!=='cerrarModalEditar'){
            if(cartaSeleccionada){
                if(quitarBusqueda){
                    accion='volverBusqueda';
                }else{
                    accion='volver';
                }
            }else if(quitarBusqueda){
                accion='volver';
            }
        }
        
        switch (accion) {
            case 'volverBusqueda':
                mostrarBusqueda(ultimaBusqueda);
                accion='';
                break;
            case 'volver':
                Mostrar();
                accion='';
                break;
            case 'cerrarModalConfiguraciones':
                modalInstanceConfiguraciones.hide();
                accion='';
                break;
            case 'volverModal':
                modalInstanceContactos.hide();
                modalInstanceConfiguraciones.show();
                accion='cerrarModalConfiguraciones';
                break;
            case 'cerrarModalAgregar':
                modalInstanceAgregar.hide();
                accion='';
                break;
            case 'cerrarModalEditar':
                modalInstanceEditar.hide();
                accion='';
                break;
            default:
                navigator.app.exitApp();
                break;
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
        
        let pulsado = false;
        let tiempoPulsado = 0;

        carta.addEventListener('touchstart', function(event) {
            pulsado = true;
            tiempoPulsado = new Date().getTime();
        });

        carta.addEventListener('touchend', function(event) {
            pulsado = false;
            let tiempoSoltado = new Date().getTime();
            let diferenciaTiempo = tiempoSoltado - tiempoPulsado;

            const editables=document.querySelectorAll('.editable',null);
                if(editables){
                    editables.forEach(editable=>{
                        let contenedorOpciones=editable.querySelector('.contenedorBorrar');
                        contenedorOpciones.classList.remove('contenedorOpciones');
                        contenedorOpciones.classList.add('d-none');
                        editable.querySelector('.card-body').classList.remove('filtro')
                        editable.classList.remove('editable');
                    })
                }
        
            if (diferenciaTiempo >= 500) {
                carta.classList.add('editable');
                carta.querySelector('.card-body').classList.add('filtro');
                contenedorBorrar.classList.add('contenedorOpciones');
                contenedorBorrar.classList.remove('d-none');
                // Acción diferente
            } else {
                carta.classList.remove('editable');
                contenedorBorrar.classList.remove('d-none','contenedorOpciones');
                carta.classList.add('expandida');
                contenedorCartas.classList.remove('row-cols-2');
                carta.querySelector('.card-body').classList.remove('filtro');
            }
        });
        //escuchamos si el mouse esta encima de la nota
        /* carta.addEventListener('mouseover',()=>{
            //al pasar por la nota, se muestra el contenedor del boton borra y editar
            contenedorBorrar.classList.remove('d-none');
            carta.classList.add('expandida');
            contenedorCartas.classList.remove('row-cols-2','row-cols-md-4');
        }); */
        btnAtras.addEventListener('click',()=>{
            //al salir de la nota, se vuelve a ocultar el contenedor de los botonos borrar y editar
            contenedorBorrar.classList.add('d-none');
            carta.classList.remove('expandida');
            contenedorCartas.classList.add('row-cols-2');
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
    console.log('Error al tomar la foto: ' + message);
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
    btnTomarFoto.textContent='Cambiar Imagen de fondo';
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
        btnTomarFoto.textContent='Agregar Imagen de fondo';
        btnQuitarFondo.classList.add('d-none');
        localStorage.removeItem('imagen');
        modalInstanceConfiguraciones.hide();
    }
}

