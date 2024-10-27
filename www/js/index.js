const ModalNotas=document.getElementById('modal');
const intanceModalNotas=new bootstrap.Modal(ModalNotas);
const contenedorNotas=document.getElementById('contenedorNotas');

const notas=obtenerNotas();;

function agregar(){
    const tituloNotas=document.getElementById('tituloNotas').value;
    const textoNotas=document.getElementById('textoNotas').value;
    notas.push({titulo:tituloNotas,texto:textoNotas});
    localStorage.setItem('notas',JSON.stringify(notas));
    mostrarNotas();
    intanceModalNotas.hide();
}
function mostrarNotas(){
    contenedorNotas.innerHTML='';
    notas.forEach(nota => {
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

ModalNotas.addEventListener('hidden.bs.modal',()=>{
    document.getElementById('tituloNotas').value='';
    document.getElementById('textoNotas').value='';
})

function obtenerNotas(){
    let notasGuardadas=JSON.parse(localStorage.getItem('notas'));
    if(notasGuardadas===null){
        result=[]
    }else{
        result=notasGuardadas;
    }
    return result;
}

mostrarNotas()
