const inputBuscar=document.getElementById('buscar');


inputBuscar.addEventListener('keypress',(evento)=>{
    if(evento.key==='Enter'){
        const busqueda=inputBuscar.value.toLowerCase();
        mostrarBusqueda(busqueda)
    }
});

function buscarNota(notas,busqueda){

    var buscar=busqueda;
    ultimaBusqueda=buscar;

    contenedorAnuncios.innerHTML=`<div class="col-12 d-flex justify-content-center mt-3 mb-4" data-bs-theme="dark">
                                    <button type="button" class="me-1 rounded-circle border p-2 btn-close" id="btnCancelarBusqueda"></button>
                                </div>`
    contenedorCartas.innerHTML=``;

    const resultados = notas.filter(nota => {
        return nota.Titulo.toLowerCase().includes(buscar) ||
                nota.Contenido.toLowerCase().includes(buscar);
    });
    
    return resultados;
}

function mostrarBusqueda(busqueda){
    const resultados=buscarNota(notas,busqueda)
    contenedorCartas.classList.add('row-cols-2');
    if(resultados.length>=1){
        resultados.forEach(nota => {
            contenedorCartas.innerHTML+=`<div class="col colBorrar">
                                        <div class="card sin-scroll" style="background-color: ${nota.Color}" id="${nota.id}">
                                            <div class="opacity-50 d-none contenedorBorrar row me-1 mt-1 d-flex align-items-center">
                                                <div class="col-2">
                                                    <button type="button" class="atras" ms-3" title="Atras">
                                                        <i class="fa-solid fa-arrow-left" style="color: #080808;"></i>
                                                    </button>
                                                </div>
                                                <div class="col-8 d-flex justify-content-center">
                                                    <span>
                                                        ${nota.Fecha}
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
                                                <h5 class="card-title ">${nota.Titulo}</h5>
                                                <p class="card-text">${nota.Contenido}</p>
                                            </div>
                                        </div>
                                    </div>`;
        })
    }else{
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