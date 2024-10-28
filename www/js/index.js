class Notas{
    constructor(){
        this.notas=this.obtenerNotas();
        this.contenedor=document.getElementById('contenedorNotas');
        this.modal=document.getElementById('modal');
        this.instModal=new bootstrap.Modal(this.modal);
        this.anuncios=document.getElementById('contenedorAnuncios');
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
                <div class="card" onclick="notas.seleccionarNota(${index})" id="${index}">
                    <div class="card-body">
                        <h5 class="card-title text-center">${nota.titulo}</h5>
                        <p class="card-text">${nota.texto}</p>
                    </div>
                    <div class="contenedorImagen p-2">
                        ${nota.imagen ? nota.imagen.map(img => `<img src="${img}" alt="Imagen de la nota" class="img-fluid mt-2">`).join('') : ''}
                    </div>
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
        this.notas.push({ titulo, texto, imagen });
        this.guardarNota();
        this.instModal.hide();
    }
    guardarNota(){
        let notasString=JSON.stringify(this.notas)
        localStorage.setItem('notas',notasString);
    }
    seleccionarNota(index){
        const btnElimnar=document.getElementById('btnEliminar');
        const btnAgregar=document.getElementById('btnAgregar');
        btnElimnar.hidden=false;
        btnAgregar.hidden=true;
        const nota=this.notas[index];
        const titulo=document.getElementById('tituloNotas');
        const texto=document.getElementById('textoNotas');
        const imagen=document.getElementById('imgNotas');
        this.modal.setAttribute('name',`${index}`)
        titulo.value=nota.titulo;
        texto.value=nota.texto.replace(/<br>/g, '\n');
        imagen.innerHTML=`${nota.imagen ? nota.imagen.map(img => `
            <div>
                <img src="${img}" alt="Imagen de la nota" class="img-fluid mt-2">
                <button type="button" class="btn-close close-img " onclick="notas.quitarFoto(event)"></button>
            </div>`
        ).join('') : ''}`;
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
            this.eliminarNota(index);
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
        this.notas[index]=({ titulo, texto, imagen });
        this.guardarNota();
    }
    eliminarNota(index){
        this.notas.splice(index,1);
        this.guardarNota();
        this.instModal.hide();
    }
    buscarNotas(){
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
    ponerFoto(img){
        console.log(img)
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
        evento.parentNode.remove();
        if(notas.modal.hasAttribute('name')){
            const index=notas.modal.getAttribute('name');
            notas.editarNota(index);
        }
    }
}

class Manejador{
    constructor(){
        this.start=document.addEventListener('deviceready',()=>{
            this.iniciarEventos();
        });
    }
    iniciarEventos(){
        notas.modal.addEventListener('hidden.bs.modal',this.limpiarModal)
    }
    limpiarModal(){
        document.getElementById('btnEliminar').hidden=true;
        document.getElementById('btnAgregar').hidden=false;
        document.getElementById('tituloNotas').value='';
        document.getElementById('textoNotas').value='';
        document.getElementById('imgNotas').innerHTML='';
        notas.modal.removeAttribute('name');
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

}

const notas=new Notas();
notas.mostrarNotas(notas.notas);
const manejador=new Manejador();

/* manejador.iniciarEventos(); */