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
                texto: 'Una vez estes dentro de una nota vieja o nueva, encontraras un botón de opciones en la parte de abajo, si das clic ahí, podrás elegir la opción de tomar foto y asi agregarla a tu nota, ¡Agrega tantas como quieras!',
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
        this.star=this.confirmar();
    }
    confirmar(){
        const confirmacion=localStorage.getItem('confirmacion',null);
        if(confirmacion!=='true'){
            this.mostrarTutorial();
        }else{
            this.btnConfirm.checked=true;
        }
    }
    mostrarTutorial(){
        this.instModalTutorial.show();
        const btnSiguiente=document.getElementById('btnSiguiente');
        const btnAnterior=document.getElementById('btnAnterior');
        const btnFin=document.getElementById('btnFin');
        const tutorialActual=this.tutoriales[this.tutorialIndex];

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