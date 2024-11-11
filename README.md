
 
# MataNotas
Aplicación de notas simple y fácil de usar, desarrollada con Cordova para fines educativos. Permite crear, editar, borrar y guardar notas, así como agregar imágenes y ubicaciones geográficas. Un proyecto ideal para aprender los fundamentos del desarrollo móvil.

###### Dentro de la carpeta Notas se puede encontrar documentación más explicita sobre el proyecto

#### Luego de clonar el repositorio debe instalar:
~~~    
cordova platform add android@13.0.0
cordova platform add browser@7.0.0
cordova plugin add cordova-plugin-camera@7.0.0
cordova plugin add cordova-plugin-dialogs@2.0.2
cordova plugin add cordova-plugin-file@8.1.2
cordova plugin add cordova-plugin-geolocation@5.0.0
cordova plugin add cordova-plugin-media@7.0.0  

~~~

# Comandos  
- Compilar:
    ~~~
    cordova build android
    ~~~
- Compilar para Google:
    ~~~
    cordova build android  -release
    ~~~
- Probar en Android:
    ~~~
    cordova run android
    ~~~
- Probar en Browser:
    ~~~
    cordova run browser
    ~~~

## Clase 1  
### Requisitos previos
- Sistema operativo: Windows, macOS o Linux.  
- Conexión a internet: Para descargar los instaladores.
### 1. Instalación de Node.js
- Descarga [Node.js](ttps://nodejs.org/)  
- Ejecuta el instalador y sigue las instrucciones.
### 2. Instalación de Cordova
- Abre una terminal o línea de comandos.  
  - Ejecuta el siguiente comando:  
    ~~~
    npm install -g cordova  
    ~~~
### 3. Configuración del JDK (Java Development Kit)
- Descarga: Descarga el JDK 18.0.2.1 desde el sitio web de Oracle.  
- Sigue las instrucciones del instalador para colocar el JDK en la carpeta C:\Program Files.  
  - Configuración de variables de entorno:  
    - Abre el *Panel de control* -> *Sistema y seguridad* -> *Sistema* -> *Configuración avanzada del sistema* -> *Variables de entorno*  
    - En **"Variables del sistema"** crea una nueva variable:  
            Nombre: JAVA_HOME  
            Valor: La ruta hasta la carpeta del JDK (por ejemplo, C:\Program Files\Java\jdk-18.0.2.1)  
    - Edita la variable "Path" y agrega las siguientes rutas:
%JAVA_HOME%\bin
%JAVA_HOME%\jre\bin  
### 4. Configuración de Gradle
- Descarga: Descarga Gradle 8.7 y colócalo en C:\Program Files  
- Configuración de variables de entorno:  
    - Crea una nueva variable:  
Nombre: GRADLE_HOME
Valor: La ruta hasta la carpeta de Gradle (por ejemplo, C:\Program Files\gradle-8.7)
    - Edita la variable "Path" y agrega la ruta: %GRADLE_HOME%\bin  
### 5. Instalación de Android Studio y SDK
- Descarga e instalación: Descarga [Android Studio](https://developer.android.com/studio) y sigue las instrucciones de instalación.  
- Configuración del SDK:
    - Abre Android Studio y configura el SDK para incluir al menos las siguientes versiones:
        - Android 13 (Tiramisu)
        - Android 14 (API level 34)
        - Android API 35.
    - Instala las herramientas necesarias como Android SDK Build Tools, Android SDK Platform-tools, Android Emulator, etc.
    - Configuración de variables de entorno:
        - Crea una nueva variable:
Nombre: ANDROID_HOME  
Valor: La ruta hasta la carpeta del SDK (por ejemplo, C:\Users\tu_usuario\AppData\Local\Android\Sdk)
        - Edita la variable "Path" y agrega las siguientes rutas:
%ANDROID_HOME%\platform-tools  
%ANDROID_HOME%\tools  
%ANDROID_HOME%\build-tools  
%ANDROID_HOME%\emulator  
%ANDROID_HOME%\cmdline-tools  
%ANDROID_HOME%\build-tools\34.0.0  
### 6. Creación de tu primer proyecto Cordova  
- Abre una terminal o línea de comandos.
- Navega hasta la carpeta donde deseas crear tu proyecto.
- Ejecuta el siguiente comando:  
~~~
cordova create mi_proyecto com.ejemplo.mi_proyecto MiProyecto
~~~

> mi_proyecto: Nombre de la carpeta del proyecto.  
com.ejemplo.mi_proyecto: Identificador único del proyecto.
MiProyecto: Nombre de la aplicación.  

- Agrega las plataformas:
~~~
cordova platform add android
~~~
~~~
cordova platform add browser
~~~

- Construye la aplicación:
~~~
cordova build android
~~~

***Recursos Adicionales***

> Documentación de [Cordova](https://cordova.apache.org/docs/en/latest/)  
Foros de Cordova: Busca en foros como Stack Overflow para resolver dudas.  


### 7. Hacemos un bosquejo general de la aplicación:  
- Borramos todos los comentarios que nos deja Apache Cordova.  
- Quitamos todo lo que encontramos en **index.js**.
- Quitamos todo lo que está en **index.css**.
- Quitamos todo lo que está dentro de la etiqueta **<body>** en **index.html**.
- Agregamos `bootstrap` y `fontAweson` al proyecto.
- Dentro del **<body>** en **index.html** creamos un contenedor donde dibujaremos lo que serían nuestras notas, además del botón desde el cual posteriormente estaremos agregando las notas.  
#### Nota
> Cuando se esté llamando al `bootstrap`, al `fontAweson` y a nuestras propias librerías, hay que tener en cuenta el orden en que se llaman, porque lo último que se llame, va a ser lo que tendrá más relevancia sobre los demás (*sobre todo en los estilos*)  
___  
## Clase 2  
#### Objetivos:

- Implementar la funcionalidad de agregar notas.
- Introducir la programación orientada a objetos.

#### Contenido:

### 1. Solución al problema del texto largo:

Se agregó el estilo `overflow-y: auto; overflow-x: hidden;` a la clase .card para permitir el desplazamiento vertical y evitar que el texto se salga de los límites.
### 2. Creación del modal:

Se creó un modal utilizando Bootstrap para permitir a los usuarios agregar nuevas notas.  
El modal contiene un formulario con campos para el título y el contenido de la nota.
### 3. Almacenamiento de notas:

Se utilizó **localStorage** para persistir las notas entre sesiones del navegador.
Las notas se almacenan en un array y se serializan como JSON antes de guardarlas en localStorage.
### 4. Visualización de notas:

Se creó una función para iterar sobre el array de notas y renderizarlas en la página en forma de tarjetas.
### 5. Introducción a la programación orientada a objetos:

Se creó una clase Nota para representar cada nota, encapsulando sus propiedades (título y contenido) y métodos (guardar, eliminar, editar).
Se modificó el código existente para utilizar la clase Nota, mejorando la organización y mantenibilidad del código.
#### Ventajas de la programación orientada a objetos:

- Organización: Agrupa datos y comportamiento relacionados en objetos.
- Reutilización: Permite crear múltiples objetos a partir de una misma clase.
- Mantenibilidad: Facilita la modificación y ampliación del código.
- Abstracción: Oculta la complejidad interna de los objetos.
### 6. Próximos pasos:

- Implementar los métodos de la clase Nota (eliminar, editar).
- Auto seleccionar el título al empezar a agregar la nota.  

___

# Clase 3
#### Objetivo:

- Implementar la funcionalidad de enfocar automáticamente el campo de título al abrir el modal para agregar una nueva nota.
- Permitir editar notas existentes directamente en el modal.
- Agregar la funcionalidad de eliminar notas.
- Agregar la funcionabilidad de buscar notas.
- Agregar la funcionalidad de agregar imágenes a las notas.
- Mejorar la interfaz de usuario con un menú de opciones en el modal.

### 1. Enfocando el campo de título:

Se agregó un evento onclick al botón que abre el modal para llamar un setTimeout() para asegurar que el campo de título reciba el foco después de que el modal se haya abierto completamente.
### 2. Editando notas:

- Se agregó un botón "Editar" al modal, inicialmente oculto.
    - Al hacer clic en una nota, el botón "Editar" se muestra y los campos del formulario se rellenan con los datos de la nota seleccionada.
- Se implementó un evento onclick en el botón "Editar" para guardar los cambios realizados.
- Se utilizó el índice de la nota en el array para identificar la nota a editar y actualizar sus datos.
### 3. Eliminando notas:

- Se agregó un botón "Eliminar" al modal.
    - Al hacer clic en el botón "Eliminar", se elimina la nota seleccionada del array y se actualiza el localStorage.
#### Puntos Clave:

>Uso de setTimeout(): Para asegurar que el campo de título reciba el foco después de que el modal se haya abierto.
Manejo de eventos: Se utilizaron eventos onclick para activar las diferentes funcionalidades del modal.
Manipulación del DOM: Se modificó el DOM para mostrar y ocultar elementos según sea necesario.
Manejo de arrays: Se utilizó el método splice() para eliminar elementos de un array.
### 4. Buscar Nota:
- Agregar un campo de búsqueda:

    - Se crea un input de texto con un icono de lupa para realizar las búsquedas.
    - Se asigna el evento input a este campo para detectar cada cambio en tiempo real.
- Crear la función buscarNota():

    - Obtener el texto a buscar: Se extrae el valor del input de búsqueda y se elimina cualquier espacio en blanco al principio y al final.
    - Filtrar las notas: Se utiliza el método filter() de los arrays para crear un nuevo array con las notas que coincidan con el texto de búsqueda. La coincidencia se realiza comparando el texto de búsqueda (convertido a minúsculas) con el título y el contenido de cada nota (también convertidos a minúsculas).
    - Mostrar los resultados: Se llama a la función mostrarNotas() pasando el array de notas filtradas como parámetro.
- Mostrar un mensaje si no hay resultados:

    - Se agrega un condicional para verificar si el array de notas filtradas está vacío.
        - Si está vacío, se muestra un mensaje indicando que no se encontraron resultados.
- Agregar un botón para cancelar la búsqueda:

    - Se agrega un botón de cierre con su respectivo método para limpiar el campo de búsqueda y mostrar todas las notas.
#### Detalles adicionales:
>**Eficiencia: ** Se utiliza el método toLowerCase() para realizar comparaciones sin distinción entre mayúsculas y minúsculas, lo que mejora la eficiencia de la búsqueda.
**Experiencia de usuario: ** Se agrega un mensaje claro cuando no se encuentran resultados.
**Flexibilidad: ** El código es modular y puede adaptarse fácilmente a futuras modificaciones.  

### 5. Reestructuración de las clases:

- Se agregaron propiedades para almacenar referencias a elementos del DOM como el contenedor de imágenes y el modal.
- Se crearon métodos para manejar la toma de fotos, agregar imágenes a las notas, eliminar imágenes y mostrar las imágenes en las notas y en el modal.
### 6. Mejora de la Interfaz

- Se agregó un botón de cámara en el menú de opciones del modal para tomar fotos.
- Se agregó un contenedor para mostrar las imágenes en el modal.
- Se implementó un mecanismo para eliminar imágenes individuales.
### 7. Funcionalidad:

- Se utiliza el plugin `cordova-plugin-camera` para tomar fotos.
- Se utiliza el plugin `cordova-plugin-file@8.1.0` para manejar las rutas de las imágenes.
    - Las imágenes se almacenan como URLs en el objeto de la nota.
Se muestra un mensaje de error si se produce algún error al tomar la foto.
- Se ha mejorado la experiencia de usuario al permitir editar las imágenes directamente en el modal.
#### Principales mejoras:

> **Mayor funcionalidad: ** La aplicación ahora permite agregar imágenes a las notas, enriqueciendo su contenido.
**Mejor interfaz de usuario: ** El menú de opciones en el modal facilita la gestión de las notas y las imágenes.
**Mayor flexibilidad:** La estructura del código se ha mejorado para permitir futuras ampliaciones.
___
## Clase 4

#### Objetivos:

- Agregar funcionalidad de color aleatorio a las notas.
- Implementar la integración con Google Maps para mostrar la ubicación de las notas.
    - Agregar un botón de ubicación en el modal para seleccionar la ubicación actual.
- Implementación del plugin de diálogos para confirmar o no la eliminación de elementos. 
- Mejorar la experiencia del usuario permitiéndole usar el botón de retroceso del dispositivo.
### 1. Color aleatorio:

- Se creó una función colorRandom() para generar colores aleatorios en formato HSL.
- El color generado se asigna a cada nota y se utiliza para el fondo de las tarjetas.
### 2. Integración con Google Maps:

- Se utilizó el plugin cordova-plugin-geolocation para obtener la ubicación del dispositivo.
- Se agregó la opción para tomar la ubicacion y almacenarla en un botón.
    - Dicho botón puede abrir la app de Google Maps con la ubicación que tiene almacenada, o si se deja presionado nos da la opción de eliminarlo.
### 3. Cuadros de Dialogos:
-Se implementó un nuevo método que permite consultar al usuario si desea o no eliminar ciertas cosas (imágenes, ubicacion, notas).
### 4. Botón de retroceso:

- Se implementó un mecanismo para manejar el botón de retroceso del dispositivo, permitiendo navegar entre las diferentes pantallas de la aplicación.
#### Detalles adicionales:

>**Geolocalización: ** La aplicación puede almacenar la ubicación geográfica de cada nota.
**Interfaz de usuario mejorada: ** El menú de opciones y el botón de retroceso hacen que la aplicación sea más fácil de usar.
___

## Clase 5
### Objetivos:
- Agregar funciones para la captura, almacenamiento y reproducción de audio.
- Personalización de la app.
- Agregar políticas de seguridad.

### 1. Integración del Plugin de Audio
En esta clase, nos enfocaremos en agregar la funcionalidad de grabación y reproducción de audio a nuestra aplicación. Para ello, utilizaremos el plugin cordova-plugin-media.

Instalación del Plugin
~~~
cordova plugin add cordova-plugin-media
~~~
##### Uso del Plugin
Este plugin nos proporciona una serie de métodos para interactuar con archivos de audio. Los más relevantes para nuestro proyecto son:

- startRecord: Inicia la grabación de un archivo de audio.
- stopRecord: Detiene la grabación de un archivo de audio.
- release: Libera los recursos de audio del sistema operativo.
- play: Inicia o reanuda la reproducción de un archivo de audio.

### 2. Personalización de la Aplicación
Para personalizar nuestra aplicación, realizaremos los siguientes cambios en el archivo config.xml:
~~~
<platform name="android">
        <icon src="www/img/icon-ldpi.png" density="ldpi"/>
        <icon src="www/img/icon-mdpi.png" density="mdpi" />
        <icon src="www/img/icon-hdpi.png" density="hdpi" />
        <icon src="www/img/icon-xhdpi.png" density="xhdpi" />
        <icon src="www/img/icon-xxhdpi.png" density="xxhdpi" />
        <icon src="www/img/icon-xxxhdpi.png" density="xxxhdpi" />
        <preference name="AndroidWindowSplashScreenAnimatedIcon" value="www/img/logo.png"/>
        <preference name="AndroidWindowSplashScreenBackground" value="#da7391" />
    </platform>
~~~

>Las etiquetas `<icon>` se usa para el icono de la app y en este caso hacen referencia a las imágenes previamente almacenadas dentro de la carpeta raíz del proyecto y configuradas con las siguientes expecificaciones para adaptarse a diferentes dispositivos: ldpi    : 36x36 px, mdpi    : 48x48 px, hdpi    : 72x72 px, xhdpi   : 96x96 px, xxhdpi  : 144x144 px, xxxhdpi : 192x192 px.
La etiqueta con el name `AndroidWindowSplashScreenAnimatedIcon` es para la imagen de la animación de cuando se inicia la app y su valor es la imagen previamente almacenada en la carpeta raíz del proyecto.
la etiqueta con el name `AndroidWindowSplashScreenBackground` es para el color de fondo de la animación de cuando se inicia la app y su valor es un color RGB.

### 3. Política de Seguridad
Agregar una etiqueta <meta> con el atributo http-equiv="Content-Security-Policy" para definir la política de seguridad de la aplicación.

~~~
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: https://ssl.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
~~~

donde:
1.	default-src: Esta linea define la política de origen por defecto para la mayoría de los recursos (scripts, estilos, imágenes, etc.) que no tengan una directiva específica.
    1. Valores:
        - `'self'`: Permite cargar recursos del mismo origen que la página.
        - `data:`: Permite cargar recursos que se utilizan en formato de URL de datos (data URLs).
        - `https://ssl.gstatic.com`: Permite cargar recursos desde este dominio específico.
        - `'unsafe-eval'`: Permite la evaluación de código JavaScript a través de `eval()` y funciones similares (esto puede representar un riesgo de seguridad).

2. style-src: Define de dónde se pueden cargar las hojas de estilo (CSS).
    2. Valores:
          - `'self'`: Permite cargar estilos del mismo origen.
          - `'unsafe-inline'`: Permite el uso de estilos en línea (esto también puede ser un riesgo de seguridad).

3. media-src: Define de dónde se pueden cargar recursos multimedia (audio, video, etc.).
    3. Valores:
        - `*`: Permite cargar recursos de cualquier origen, lo cual es muy permisivo.

4. img-src: Define de dónde se pueden cargar imágenes.
    4. Valores:
          - `'self'`: Permite cargar imágenes del mismo origen.
          - `data:`: Permite cargar imágenes en formato de URL de datos.
          - `content:`: Este valor es menos común y puede estar relacionado con el contenido de las imágenes.
___  

## Clase 6
### Objetivos:
- Firmar la aplicación.
- Subir la aplicación a Google Play.
- Compilar proyecto de React.

### 1. Firmar la aplicación
1. Crear el keystore:
    - En el CMD, nos dirigimos a la carpeta raíz de nuestro proyecto e ingresamos:
~~~
keytool -genkey -v -keystore NOMBREAPP.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias ALIASAPP
~~~
>Donde `NOMBREAPP` y `ALIASAPP` lo puedes adaptar a tu gusto.
una vez ingresado el comando, el sistema te va a pedir unos datos, anótalos y guárdalos en un lugar seguro porque los podrias necesitar.
NOTA: al ingresar la clave, no se muestra lo que se digita, pero si esta agarrando la clave y al finalizar, para confirmar, hay que ingresar "y" (de yes).
2. Compilar la app para obtener el .AAB (formato admitido por Google Play):
~~~
cordova build android –release
~~~
>al finalizar la compilación, nos dará la ruta donde quedara almacenada la app, guarda esa ruta.
3. Firmamos la app:
~~~
jarsigner -keystore NOMBREAPP.keystore -storepass CLAVE -keypass CLAVE RUTA_A_LA_APP ALIASAPP
~~~
>`NOMBREAPP` y `ALIASAPP` son los mismos que ingresamos en el comando anterior al crear el keystore.
`CLAVE` es la que creamos cuando se hizo el keystore y se repite 2 veces.
`RUTA_A_LA_APP` la ruta que nos arrojo al compilar.

4. Verificar firma:
~~~
jarsigner -verify -verbose -certs RUTA_A_LA_APP
~~~
>`RUTA_A_LA_APP` la ruta que nos arrojo al compilar.

### 2. Subir la app a Google Play
1. crear cuenta de desarrollador en [Google Play Console](https://play.google.com/console/u/0/signup).
    - necesitaras:
        - 1 correo electrónico para la cuenta.
        - 1 correo electrónico para comunicación.
        - 1 número de teléfono para comunicación.
        - pago único de 25$.
2. Crear una nueva app:
    - Hay que tener listo:
        - Descripción de la app.
        - Un link con las [políticas de privacidad](https://app.privacypolicies.com/ ).
        - Icono de la app.
        - Captures de como se ve la app en diferentes dispositivos (por lo menos 1).
        - 1 imagen de 1024x500px donde se muestren las principales funcionabilidades de la app.
        - Público objetivo.
        - 20 personas que deseen ser nuestros verificadores.
    - Hay que llenar toda la información que nos piden.

Creada la app, podemos trabajar diferentes tipos de pruebas:
1. Interna: la más básica, donde participa un grupo de verificadores y no tiene mayor incidencia en tu cuenta.
2. Cerrada (Alpha): solo participa un grupo de verificadores y es el inicio para poder entrar en producción. **Nota: la 1ra vez que subes una app, debes pasar mínimo 14 días de pruebas cerradas con por lo menos 20 verificadores para poder acceder a producción**.
3. Abierta (beta): prueba opcional, cualquiera podría inscribirse y participar.

Cada prueba, de ser satisfactoria, te da la opción de acceder esa versión al siguiente escalafón, siendo producción el ultimo (ya la aplicación en la tienda, disponible para todos).
### 3. Compilar proyecto de React.

1. tener un proyecto en react.
2. crear un proyecto de cordova.
3. fusionar los proyectos.
4. crear un hook.
5. compilar.
>Para más información, puede consultar el siguiente [tutorial](https://medium.com/@pshubham/using-react-with-cordova-f235de698cc3) o revisar la carpeta de Notas.
___
          
