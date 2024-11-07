class Notas{
    constructor(){
        this.notas=this.obtenerNotas();
        this.contenedor=document.getElementById('contenedorNotas');
        this.modal=document.getElementById('modal');
        this.instModal=new bootstrap.Modal(this.modal);
        this.anuncios=document.getElementById('contenedorAnuncios');
        this.instOffCanvas=new bootstrap.Offcanvas('#opcionesModal');
        this.Offcanvas=document.getElementById('opcionesModal')
    }
    obtenerNotas(){
        let notasGuardadas=JSON.parse(localStorage.getItem('notas'));
        return notasGuardadas || []
    }
    mostrarNotas(notasFiltradas){
        this.contenedor.innerHTML='';
        notasFiltradas.forEach((nota,index) => {
            nota.texto=nota.texto.replace(/\n/g, '<br>')
            this.contenedor.innerHTML+=`
                <div class="col">
                <div class="card" onclick="notas.seleccionarNota(${index})" id="${index}" style="background-color: ${nota.color}">
                    ${nota.audio && nota.audio.length >= 1 || nota.ubicacion!=='' || nota.imagen && nota.imagen.length>=1 ? `
                        <div class="card-header d-flex justify-content-end sticky-top border-0 rounded-bottom" style="background-color: ${nota.color}" >
                            <div class="contenedorUbicacion mt-1 me-auto">
                                ${nota.ubicacion!=='' ? `
                                    <div>
                                        <i class="fa-solid fa-location-dot fa-sm"></i>
                                    </div>
                                `:''}
                            </div>
                            <div class="contenedorVoces me-3 mt-1">
                                ${nota.audio && nota.audio.length >= 1 ? `
                                    <span class="position-absolute top-0 star-0 ms-5 translate-middle badge rounded-pill bg-success">
                                        ${nota.audio.length}
                                    </span>
                                    <i class="fa-solid fa-play fa-sm ms-4"></i>
                                `:''}
                            </div>
                            <div class="contenedorVoces me-3 mt-1">
                                ${nota.imagen && nota.imagen.length >= 1 ? `
                                    <span class="position-absolute top-0 star-0 ms-5 translate-middle badge rounded-pill bg-success">
                                        ${nota.imagen.length}
                                    </span>
                                    <i class="fa-solid fa-image fa-sm ms-4"></i>
                                `:''}
                            </div>
                        </div>
                    `: ''}
                    <div class="card-body">
                        <h5 class="card-title text-center">${nota.titulo}</h5>
                        <p class="card-text">${nota.texto}</p>
                    </div>
                    <div class="contenedorImagen m-1 row">
                        ${nota.imagen ? nota.imagen.map(img => `
                            <div class="col-4 p-1">
                                <img src="${img}" alt="Imagen de la nota" class="img-fluid mt-2 rounded shadow-lg">
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
            `;
        });
    }
    agregarNota(){
        const titulo=document.getElementById('tituloNotas').value;
        const texto=document.getElementById('textoNotas').value;
        const contenedorImg=document.getElementById('imgNotas');
        const imagenes=contenedorImg.getElementsByTagName('img');
        const imagen=[];
        for(let i = 0; i < imagenes.length; i++){
            imagen.push(imagenes[i].src);
        }
        const color=this.colorRandom();
        var ubicacion;
        document.getElementById('ubicacion').dataset.ubicacion ? ubicacion=document.getElementById('ubicacion').dataset.ubicacion : ubicacion="";
        const contenedorAudios=document.getElementById('audios');
        const audios=contenedorAudios.getElementsByTagName('i');
        const audio=[];
        for(let i = 0; i < audios.length; i++){
            audio.push(audios[i].dataset.audio);
        }
        this.notas.push({ titulo, texto, imagen, color, ubicacion, audio });
        this.guardarNota();
        this.instModal.hide();
    }
    guardarNota(){
        let notasString=JSON.stringify(this.notas);
        localStorage.setItem('notas',notasString);
        this.instOffCanvas.hide();
    }
    seleccionarNota(index){
        const btnElimnar=document.getElementById('btnEliminar');
        const btnAgregar=document.getElementById('btnAgregar');
        const btnUbicacion=document.getElementById('ubicacion');
        btnElimnar.hidden=false;
        btnAgregar.hidden=true;
        const nota=this.notas[index];
        const titulo=document.getElementById('tituloNotas');
        const texto=document.getElementById('textoNotas');
        const imagen=document.getElementById('imgNotas');
        const audios=document.getElementById('audios');

        this.modal.setAttribute('name',`${index}`)
        titulo.value=nota.titulo;
        texto.value=nota.texto.replace(/<br>/g, '\n');
        imagen.innerHTML=`${nota.imagen ? nota.imagen.map(img => `
            <div>
                <img src="${img}" alt="Imagen de la nota" class="img-fluid mt-2">
                <button type="button" class="btn-close close-img " onclick="notas.quitarMultimedia(event)"></button>
            </div>`
        ).join('') : ''}`;
        if(nota.ubicacion!==""){
            btnUbicacion.hidden=false;
            btnUbicacion.dataset.ubicacion=nota.ubicacion;
            
        }
        audios.innerHTML=`${nota.audio ? nota.audio.map(src=>`
            <div class="mt-3 d-flex justify-content-star">
                    <i class="fa-solid fa-play fa-2xl ms-4 audio" style="color: #ffffff;" onclick="manejador.reproducir('${src}')" data-audio="${src}"></i>
                    <i class="fa-solid fa-trash fa-xl ms-auto me-4" style="color: #ffffffab;" onclick="notas.quitarMultimedia(event)"></i>
            </div>`
        ).join(''):''}`;

        this.instModal.show();

        titulo.oninput=()=>{
            if (this.modal.hasAttribute('name')) {
                const indice = this.modal.getAttribute('name');
                this.editarNota(indice);
            }
        }
        texto.oninput=()=>{
            if (this.modal.hasAttribute('name')) {
                const indice = this.modal.getAttribute('name');
                this.editarNota(indice);
            }
        }
        btnElimnar.onclick=()=>{
            manejador.confirmacion()
            .then(res=>{
                if(res===1){
                    this.eliminarNota(index);
                }else{
                    this.instOffCanvas.hide();
                }
            })
            .catch(error=>{
                console.log(error);
            });
        }
    }
    editarNota(index){
        const titulo=document.getElementById('tituloNotas').value;
        const texto=document.getElementById('textoNotas').value;
        const contenedorImg=document.getElementById('imgNotas');
        const imagenes=contenedorImg.getElementsByTagName('img');
        const imagen=[];
        for(let i = 0; i < imagenes.length; i++){
            imagen.push(imagenes[i].src);
        }
        const color=this.notas[index].color;
        var ubicacion;
        document.getElementById('ubicacion').dataset.ubicacion ? ubicacion=document.getElementById('ubicacion').dataset.ubicacion : ubicacion="";
        const contenedorAudios=document.getElementById('audios');
        const audios=contenedorAudios.querySelectorAll('.audio');
        const audio=[];
        for(let i = 0; i < audios.length; i++){
            audio.push(audios[i].dataset.audio);
        }
        this.notas[index]=({ titulo, texto, imagen, color, ubicacion, audio });
        this.guardarNota();
    }
    eliminarNota(index){
        this.notas.splice(index,1);
        this.guardarNota();
        this.instModal.hide();
    }
    buscarNotas(){
        manejador.pantallaActual='buscarNota';
        const textoBuscar=document.getElementById('buscar').value.trim();
        const notasFiltradas=this.notas.filter(nota=>{
            return nota.titulo.toLowerCase().includes(textoBuscar.toLowerCase()) ||
            nota.texto.toLowerCase().includes(textoBuscar.toLowerCase());
        });
        if(notasFiltradas.length>=1){
            this.anuncios.innerHTML=`
            <div class="col-12 d-flex justify-content-center mt-3 mb-4">
                <button type="button" class="me-1 rounder-circle border p-2 btn-close" id="cancelarBusqueda" onclick="notas.cancelarBusqueda()"></button>
            </div>    
        `
        }else{
            this.anuncios.innerHTML=`
            <div class="col-12 d-flex justify-content-center">
                <h1 class="text-center opacity-50 text-light">
                    Sin resultados
                </h1>
            </div>
            <div class="col-12 d-flex justify-content-center mt-3 mb-4">
                <button type="button" class="me-1 rounder-circle border p-2 btn-close" id="cancelarBusqueda" onclick="notas.cancelarBusqueda()"></button>
            </div>    
        `
        }
        this.mostrarNotas(notasFiltradas);
    }
    cancelarBusqueda(){
        document.getElementById('buscar').value='';
        this.anuncios.innerHTML='';
        this.mostrarNotas(this.notas);
    }
    colorRandom() {
        const matiz = Math.floor(Math.random() * 360);
        const saturacion = Math.random() * 0.4 + 0.6;
        const ligereza = Math.random() * 0.3 + 0.7;
        return `hsl(${matiz}, ${saturacion * 100}%, ${ligereza * 100}%)`;
    }
    ponerFoto(img){
        if(notas.modal.classList.contains('show')){
            document.getElementById('imgNotas').innerHTML+=`
                <div>
                    <img src="${img}" alt="" class="img-fluid mt-2">
                    <button type="button" class="btn-close close-img " onclick="notas.quitarMultimedia(event)"></button>
                </div>`;
            if(notas.modal.hasAttribute('name')){
                const index=notas.modal.getAttribute('name');
                notas.editarNota(index);
            }
        }
    }
    quitarMultimedia(event){
        const evento=event.target;
        manejador.confirmacion()
        .then(res=>{
            if(res===1){
                evento.parentNode.remove();
                if(notas.modal.hasAttribute('name')){
                    const index=notas.modal.getAttribute('name');
                    notas.editarNota(index);
                }
            }
        })
        .catch(error=>{
            console.log(error);
        })
    }
    ponerUbicacion(ubicacion){
        const btnUbicacion=document.getElementById('ubicacion');
        btnUbicacion.hidden=false;
        btnUbicacion.dataset.ubicacion=ubicacion;
        this.instOffCanvas.hide();
        if(notas.modal.hasAttribute('name')){
            const index=notas.modal.getAttribute('name');
            notas.editarNota(index);
        }
    }
    activarLink(){
        const btnUbicacion = document.getElementById('ubicacion');
        let timeoutId;
    
        timeoutId = setTimeout(() => {
            manejador.confirmacion()
                .then(res=>{
                    if (res===1) {
                        btnUbicacion.hidden = true;
                        btnUbicacion.removeAttribute('data-ubicacion');
                        
                        if(notas.modal.hasAttribute('name')){
                            const index=notas.modal.getAttribute('name');
                            notas.editarNota(index);
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }, 500); // Espera 500 ms antes de llamar a confirmacion
        btnUbicacion.onmouseup=()=>{
            clearTimeout(timeoutId);
            window.open(btnUbicacion.dataset.ubicacion, "_blank");
        };        
    }
    ponerAudio(src){
        document.getElementById('audios').innerHTML+=`
            <div class="mt-3 d-flex justify-content-star">
                    <i class="fa-solid fa-play fa-2xl ms-4 audio" style="color: #ffffff;" onclick="manejador.reproducir('${src}')" data-audio="${src}"></i>
                    <i class="fa-solid fa-trash fa-xl ms-auto me-4" style="color: #ffffffab;" onclick="notas.quitarMultimedia(event)">
                    </i>
            </div>
        `
        if(notas.modal.hasAttribute('name')){
            const index=notas.modal.getAttribute('name');
            notas.editarNota(index);
        }
    }
    
}

class Tutorial{
    constructor(){
        this.tutoriales = [
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
                titulo: '¡Tambien puedes agregar fotos a tus notas!',
                texto: 'Una vez estes dentro de una nota vieja o nueva, encontraras un botón de opciones en la parte de abajo, si das clic ahí, podrás elegir la opción de tomar foto o de subir una y agregarla a tu nota, ¡Agrega tantas como quieras!',
            },
            {
                imagen: '',
                titulo: '¿Audios?',
                texto: '¡Por supuesto! los audios también están a la orden del día y los agregas de forma similar a las fotos.',
            },
            {
                imagen: '',
                titulo: 'Características adicionales',
                texto: 'Además de fotos y audios, también puedes almacenar una ubicación por nota. Sí encontraste un super descuento o necesitas tomar nota de un lugar especial... tómale una foto, escribe o habla sobre ese lugar y guarda su ubicación para poder llegar ahí nuevamente',
            },
            {
                imagen: '',
                titulo: '¿Necesitas eliminar algo?',
                texto: 'Si necesitas quitar la ubicación, solo déjala presionada y podrás eliminarlas. Sí es una nota, debes entrar en ella y buscar la opción "Eliminar Nota", el resto de elementos muestran una "x" o una papelera para eliminarlos',
            },
            {
                imagen: '',
                titulo: 'Esperamos que te guste',
                texto: 'El resto de la aplicación es muy intuitiva, pero si tienes alguna duda déjanosla saber en Google Play o en cualquiera de nuestros contactos que encontraras en las configuraciones',
            },
        ];
        this.modalTutorial=document.getElementById('modalTutorial');
        this.instModalTutorial=new bootstrap.Modal(this.modalTutorial);
        this.tutorialIndex=0;
        this.btnConfirm=document.getElementById('btnConfirm');
    }
    confirmar(){
        const confirmacion=localStorage.getItem('confirmacion',null);
        if(confirmacion!=='true'){
            this.mostrarTutorial();
            return true
        }else{
            this.btnConfirm.checked=true;
            return false
        }
    }
    mostrarTutorial(){
        this.instModalTutorial.show();
        const btnSiguiente=document.getElementById('btnSiguiente');
        const btnAnterior=document.getElementById('btnAnterior');
        const btnFin=document.getElementById('btnFin');
        const tutorialActual=this.tutoriales[this.tutorialIndex];
        manejador.pantallaActual='tutorial';

        document.getElementById('tutorialTitulo').textContent=tutorialActual.titulo;
        document.getElementById('tutorialContenido').textContent=tutorialActual.texto;
        if(tutorialActual.imagen!==''){
            document.getElementById('tutorialImagen').src=tutorialActual.imagen;
        }
        
        if(this.tutorialIndex===this.tutoriales.length-1){
            btnSiguiente.classList.add('d-none');
            btnFin.classList.remove('d-none');
        }else{
            btnSiguiente.classList.remove('d-none');
            btnFin.classList.add('d-none');
        }
        if(this.tutorialIndex===0){
            btnAnterior.classList.add('d-none');
        }else{
    
            btnAnterior.classList.remove('d-none');
        }

        btnSiguiente.onclick=()=>{
            this.tutorialIndex++;
            this.mostrarTutorial();
        }
        btnAnterior.onclick=()=>{
            this.tutorialIndex--;
            this.mostrarTutorial();
        }
        btnFin.onclick=()=>{
            this.instModalTutorial.hide();
        }
        this.btnConfirm.onchange=()=>{
            if(this.btnConfirm.checked){
                localStorage.setItem('confirmacion',true);
            }else{
                localStorage.removeItem('confirmacion',false);
            }
        }
    }
}

class Manejador{
    constructor(){
        this.pantallaActual='';
        this.start=document.addEventListener('deviceready',()=>{
            this.iniciarEventos();
        });
        this.mediaRec=null;
    }
    iniciarEventos(){
        if(!tutorial.confirmar()){
            tutorial.confirmar();
        };
        notas.modal.addEventListener('hidden.bs.modal',this.limpiarModal);
        notas.modal.addEventListener('show.bs.modal',()=>{this.pantallaActual='modalAbierto'});
        notas.Offcanvas.addEventListener('show.bs.offcanvas',()=>{this.pantallaActual='offCanvas'});
        notas.Offcanvas.addEventListener('hidden.bs.offcanvas',()=>{this.pantallaActual='modalAbierto'});
        tutorial.modalTutorial.addEventListener('hidden.bs.modal',()=>{this.pantallaActual=''});
        modalContactos.addEventListener('hidden.bs.modal',()=>{manejador.pantallaActual=''});

        document.addEventListener("backbutton",()=>{
            this.atras()
        });
    }
    limpiarModal(){
        document.getElementById('btnEliminar').hidden=true;
        document.getElementById('btnAgregar').hidden=false;
        document.getElementById('tituloNotas').value='';
        document.getElementById('textoNotas').value='';
        document.getElementById('imgNotas').innerHTML='';
        document.getElementById('audios').innerHTML='';
        notas.modal.removeAttribute('name');
        const btnUbicacion=document.getElementById('ubicacion');
        btnUbicacion.removeAttribute('data-ubicacion');
        btnUbicacion.hidden=true;
        notas.mostrarNotas(notas.notas);
    }
    tomarFoto(medio){
        if(medio==='camara'){
            medio=Camera.PictureSourceType.CAMERA;
        }else if(medio==='album'){
            medio=Camera.PictureSourceType.PHOTOLIBRARY;
        }
        var options={
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: medio,
            correctOrientation: true,
            //saveToPhotoAlbum: true, // Guarda la foto en la galería del dispositivo
            encodingType: Camera.EncodingType.JPEG
        };
        navigator.camera.getPicture(onSuccess, onFail, options);
        function onSuccess(imageURI) {
            const win=(fileEntry)=>{
                const img=fileEntry.toURL();
                if(notas.modal.classList.contains('show')){
                    notas.instOffCanvas.hide()
                    notas.ponerFoto(img)
                }
            };
            const fail=(error)=>{
                console.error('error al guardar foto ',error);
            }
            window.resolveLocalFileSystemURL(imageURI,win,fail);
        }
        function onFail(message){
            console.log('Error al tomar la foto: ' + message);
        }
    }
    tomarUbicacion(){
        var options={ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };

        function onSuccess(position) {
            var ubicacion=`https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
            notas.ponerUbicacion(ubicacion);
        }
        function onError(error) {
            console.log('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }
    
        // Options: throw an error if no update is received every 30 seconds.
        //
        var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
    confirmacion(){
        return new Promise((res,rej)=>{
            navigator.notification.confirm(
            '¿Desea Continuar??',
                (btnIndex)=>{
                    res(btnIndex);
                },            
                    'Atención',           
                    ['Si','no']     
                );
        });
    }
    atras(){
        switch (this.pantallaActual) {
            case 'modalAbierto':
                notas.instModal.hide();
                this.pantallaActual='';
                break;
            case 'buscarNota':
                notas.cancelarBusqueda();
            this.pantallaActual='';
                break;
            case 'offCanvas':
                notas.instOffCanvas.hide();
                this.pantallaActual='modalAbierto';
                break;
            case 'tutorial':
                break;
            case 'configuraciones':
                instModalConfiguraciones.hide();
                this.pantallaActual='';
                break;
            case 'contactos':
                instModalContactos.hide();
                this.pantallaActual='';
                break;
            default:
                navigator.app.exitApp();
                break;
        }
    }
    tomarAudio(){
        const contenedorBtn=document.getElementById('contenedorBtnAudio');
        const fecha=this.obtenerFecha();
        var src = cordova.file.dataDirectory + `${fecha.anio}${fecha.mes}${fecha.dia}${fecha.horas}${fecha.minutos}${fecha.segundos}.aac`;

        const win=()=>{
            notas.ponerAudio(src)
        }
        const fail=()=>{
            console.log('Error');
        }

        this.mediaRec=new Media(src,win,fail);
        this.mediaRec.startRecord();

        contenedorBtn.style.display = 'block';
        notas.instOffCanvas.hide();

    }
    detenerAudio(){
        const contenedorBtn=document.getElementById('contenedorBtnAudio');
        contenedorBtn.style.display = 'none';
        if(this.mediaRec){
            this.mediaRec.stopRecord();
            this.mediaRec.release();
        }
    }
    reproducir(src){
        const win=()=>{console.log('Reproducción exitosa')};
        const fail=()=>{console.log('Error de reproducción')};
        var playback = new Media(src,win,fail);
        playback.play();
    }
    obtenerFecha(){
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Agregamos un 0 al inicio si el mes tiene un solo dígito
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const horas = fechaActual.getHours().toString().padStart(2, '0');
        const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
        const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
        return {dia,mes,anio,horas,minutos,segundos}
    }
}

const modalContactos=document.getElementById('modalContactos');
const instModalConfiguraciones = new bootstrap.Modal('#modalConfiguraciones');
const instModalContactos= new bootstrap.Modal(modalContactos);

const notas=new Notas();
notas.mostrarNotas(notas.notas);
const tutorial=new Tutorial();
const manejador=new Manejador();
