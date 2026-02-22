'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
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
    
    // Nuestro "semáforo" para evitar que lea el mismo QR 20 veces
    let puedeEscanear = true; 

    function alEscanearConExito(textoDecodificado) {
        // 1. Si el semáforo está en rojo, ignoramos el escaneo
        if (!puedeEscanear) return; 

        // 2. Ponemos el semáforo en rojo al instante
        puedeEscanear = false;

        // 3. Mostramos el mensaje visual
        mostrarMensaje(`✅ DNI: ${textoDecodificado} detectado. Registrando...`, 'exito');

        // 4. Enviamos el dato a n8n en la nube
        // ⚠️ IMPORTANTE: Reemplaza TU-APP-EN-RENDER con el enlace real de tu n8n
        fetch('http://localhost:5678/webhook-test/registro-asistencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dni: textoDecodificado })
        })
        .then(response => {
            if (!response.ok) throw new Error("Error en la red");
            console.log("Asistencia registrada con éxito en n8n.");
        })
        .catch(error => {
            console.error("Hubo un problema al registrar:", error);
            mostrarMensaje("❌ Error al enviar los datos.", "error");
        });

        // 5. Volvemos a poner el semáforo en verde después de 3 segundos
        setTimeout(() => {
            ocultarMensaje();
            puedeEscanear = true; 
        }, 3000);
    }

    function alFallarEscaneo(mensajeError) {
        // Lo dejamos vacío para que no sature la consola con errores normales de búsqueda
    }

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