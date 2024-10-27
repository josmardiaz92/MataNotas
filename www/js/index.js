const contenedorNotas=document.getElementById('contenedorNotas');
const contenedorAnuncios=document.getElementById('contenedorAnuncios');
const ModalNotas=document.getElementById('modal');
const intanceModalNotas=new bootstrap.Modal(ModalNotas);

class Notas{
    constructor(){
        this.notas=this.obtenerNotas();
    }

    obtenerNotas(){
        let notasGuardadas=JSON.parse(localStorage.getItem('notas'));
        return notasGuardadas || []
    }
    mostrarNotas(notasFiltradas){
        contenedorNotas.innerHTML='';
        notasFiltradas.forEach((nota,index) => {
            contenedorNotas.innerHTML+=`
                <div class="col">
                    <div class="card" onclick="notas.seleccionarNota(${index})" id="${index}">
                        <div class="card-body">
                            <h5 class="card-title">${nota.titulo}</h5>
                            <p class="card-text">${nota.texto}</p>
                        </div>
                    </div>
                </div>
            `
        });
    }
    agregarNota(){
        const titulo=document.getElementById('tituloNotas').value;
        const texto=document.getElementById('textoNotas').value;
        this.notas.push({titulo:titulo,texto:texto});
        this.guardarNota();
    }
    guardarNota(){
        let notasString=JSON.stringify(this.notas)
        localStorage.setItem('notas',notasString);
        this.mostrarNotas(this.notas);
        intanceModalNotas.hide();
    }
    seleccionarNota(index){
        const btnEditar=document.getElementById('btnEditar');
        const btnEliminar=document.getElementById('btnEliminar');
        document.getElementById('btnAgregar').hidden=true;
        btnEditar.hidden=false;
        btnEliminar.hidden=false;
        const nota = this.notas[index];
        const titulo=document.getElementById('tituloNotas');
        const texto=document.getElementById('textoNotas');
        titulo.value=nota.titulo;
        texto.value=nota.texto;

        intanceModalNotas.show();

        btnEditar.onclick=()=>{
            this.editarNota(index);
        };
        btnEliminar.onclick=()=>{
            this.eliminarNota(index);
        };
    }

    editarNota(index){
        const titulo=document.getElementById('tituloNotas').value;
        const texto=document.getElementById('textoNotas').value;
        this.notas[index]=({ titulo, texto });
        this.guardarNota();
    }
    eliminarNota(index){
        this.notas.splice(index, 1);        
        this.guardarNota();
    }
    buscarNota(event){
        const textoBuscar=event.target.value.trim();
        const notasFiltradas=this.notas.filter(nota=>{
            return nota.titulo.toLowerCase().includes(textoBuscar.toLowerCase()) ||
            nota.texto.toLowerCase().includes(textoBuscar.toLowerCase());
        });
        if(notasFiltradas.length>=1){
            contenedorAnuncios.innerHTML=`
                <div class="col-12 d-flex justify-content-center mt-3 mb-4" data-bs-theme="dark">
                    <button type="button" class="me-1 rounded-circle border p-2 btn-close" id="cancelarBusqueda" onclick="notas.cancelarBusqueda()"></button>
                </div>
            `;
        }else{
            contenedorAnuncios.innerHTML=`
                <div class="col-12 d-flex justify-content-center">
                    <h1 class="text-center opacity-50">
                        Sin Resultados
                    </h1>
                </div>
                <div class="col-12 d-flex justify-content-center mt-3 mb-4" data-bs-theme="dark">
                    <button type="button" class="me-1 rounded-circle border p-2 btn-close" id="cancelarBusqueda" onclick="notas.cancelarBusqueda()"></button>
                </div>`
        }
        this.mostrarNotas(notasFiltradas);
    }

    cancelarBusqueda(){
        document.getElementById('buscar').value='';
        contenedorAnuncios.innerHTML=''
        this.mostrarNotas(this.notas);
    }
}

const notas=new Notas();
notas.mostrarNotas(notas.notas);

ModalNotas.addEventListener('hidden.bs.modal',()=>{
    document.getElementById('tituloNotas').value='';
    document.getElementById('textoNotas').value='';
    document.getElementById('btnEditar').hidden=true;
    document.getElementById('btnEliminar').hidden=true;
    document.getElementById('btnAgregar').hidden=false;
})
