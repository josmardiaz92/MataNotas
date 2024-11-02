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
                    <div class="card-body">
                        <h5 class="card-title text-center">${nota.titulo}</h5>
                        <p class="card-text">${nota.texto}</p>
                    </div>
                    <div class="contenedorVoces">
                        ${nota.audio ? nota.audio.map(src=>`
                            <i class="fa-solid fa-play fa-2xl audio m-3 mt-4" style="color: #484242;" onclick="manejador.reproducir('${src}')" data-audio="${src}"></i>
                        `).join(''):''}
                    </div>
                    <div class="contenedorImagen p-2">
                        ${nota.imagen ? nota.imagen.map(img => `<img src="${img}" alt="Imagen de la nota" class="img-fluid mt-2">`).join('') : ''}
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
                <button type="button" class="btn-close close-img " onclick="notas.quitarFoto(event)"></button>
            </div>`
        ).join('') : ''}`;
        if(nota.ubicacion!==""){
            btnUbicacion.hidden=false;
            btnUbicacion.dataset.ubicacion=nota.ubicacion;
            btnUbicacion.ontouchstart=()=>{
                this.activarLink();
            }
        }
        audios.innerHTML=`${nota.audio ? nota.audio.map(src=>`
            <div class="mt-3">
                <i class="fa-solid fa-play fa-2xl audio" style="color: #ffffff;" onclick="manejador.reproducir('${src}')" data-audio="${src}"></i>
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
        const audios=contenedorAudios.getElementsByTagName('i');
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
                    <button type="button" class="btn-close close-img " onclick="notas.quitarFoto(event)"></button>
                </div>`;
            if(notas.modal.hasAttribute('name')){
                const index=notas.modal.getAttribute('name');
                notas.editarNota(index);
            }
        }
    }
    quitarFoto(event){
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
                .then(res => {
                    if (res === 1) {
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
            <div class="mt-2">
                <i class="fa-solid fa-play fa-2xl audio" style="color: #ffffff;" onclick="manejador.reproducir('${src}')" data-audio="${src}"></i>
            </div>
        `
        if(notas.modal.hasAttribute('name')){
            const index=notas.modal.getAttribute('name');
            notas.editarNota(index);
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
        notas.modal.addEventListener('hidden.bs.modal',this.limpiarModal);
        notas.modal.addEventListener('show.bs.modal',()=>{this.pantallaActual='modalAbierto'});
        notas.Offcanvas.addEventListener('show.bs.offcanvas',()=>{this.pantallaActual='offCanvas'});
        notas.Offcanvas.addEventListener('hidden.bs.offcanvas',()=>{this.pantallaActual='modalAbierto'});
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
    tomarFoto(){
        var options={
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            correctOrientation: true,
            //saveToPhotoAlbum: true, // Guarda la foto en la galería del dispositivo
            encodingType: Camera.EncodingType.JPEG
        };
        navigator.camera.getPicture(onSuccess, onFail, options);
        function onSuccess(imageURI) {
            const win=(fileEntry)=>{
                const img=fileEntry.toURL();
                notas.instOffCanvas.hide()
                notas.ponerFoto(img)
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

const notas=new Notas();
notas.mostrarNotas(notas.notas);
const manejador=new Manejador();

