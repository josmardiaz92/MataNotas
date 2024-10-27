const contenedorNotas=document.getElementById('contenedorNotas');
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
    mostrarNotas(){
        contenedorNotas.innerHTML='';
        this.notas.forEach((nota,index) => {
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
        this.mostrarNotas();
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


}

const notas=new Notas();
notas.mostrarNotas();

ModalNotas.addEventListener('hidden.bs.modal',()=>{
    document.getElementById('tituloNotas').value='';
    document.getElementById('textoNotas').value='';
    document.getElementById('btnEditar').hidden=true;
    document.getElementById('btnEliminar').hidden=true;
    document.getElementById('btnAgregar').hidden=false;
})
