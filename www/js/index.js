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
        this.notas.forEach(nota => {
            contenedorNotas.innerHTML+=`
                <div class="col">
                    <div class="card">
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

}

const notas=new Notas();
notas.mostrarNotas();

ModalNotas.addEventListener('hidden.bs.modal',()=>{
    document.getElementById('tituloNotas').value='';
    document.getElementById('textoNotas').value='';
})
