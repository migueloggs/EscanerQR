'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialización de la librería de escaneo
    const html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        },
        false
    );

    const divMensaje = document.getElementById('mensaje');

    function alEscanearConExito(textoDecodificado) {
        // 1. Pausar la cámara para evitar que lea el mismo código 10 veces en un segundo
        html5QrcodeScanner.pause();

        // 2. Dar retroalimentación visual al auxiliar
        mostrarMensaje(`✅ DNI: ${textoDecodificado} detectado. Registrando...`, 'exito');

        // 3. TODO: Aquí ejecutaremos el fetch() hacia el Webhook de n8n
        console.log("Dato listo para enviar a la base de datos:", textoDecodificado);

        // 4. Reactivar el sistema automáticamente tras 3 segundos para el siguiente alumno
        setTimeout(() => {
            ocultarMensaje();
            html5QrcodeScanner.resume();
        }, 3000);
    }

    function alFallarEscaneo(mensajeError) {
        // La librería escupe errores constantemente cuando busca un QR y no lo halla.
        // Es una buena práctica dejar esto vacío para no colapsar la consola de navegador.
    }

    // Funciones auxiliares para la interfaz
    function mostrarMensaje(texto, clase) {
        divMensaje.textContent = texto;
        divMensaje.className = clase;
    }

    function ocultarMensaje() {
        divMensaje.className = 'oculto';
        divMensaje.textContent = '';
    }

    // Arrancar el escáner
    html5QrcodeScanner.render(alEscanearConExito, alFallarEscaneo);
});