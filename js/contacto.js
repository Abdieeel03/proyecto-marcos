document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario-contacto');
    const btnLimpiar = document.getElementById('btn-limpiar');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value.trim();
            
            // Validación básica
            if (!nombre || !email || !mensaje) {
                mostrarMensaje('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            
            // Validar email
            if (!validarEmail(email)) {
                mostrarMensaje('Por favor ingresa un email válido', 'error');
                return;
            }
            
            // Simular envío del formulario
            mostrarMensaje('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'exito');
            
            // Limpiar formulario después del envío
            setTimeout(() => {
                formulario.reset();
            }, 1000);
            
            // Aquí podrías agregar código para enviar el formulario a un servidor
            console.log('Datos del formulario:', {
                nombre,
                email,
                telefono,
                asunto,
                mensaje
            });
        });
    }
    
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            formulario.reset();
            ocultarMensajes();
        });
    }
});

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarMensaje(texto, tipo) {
    ocultarMensajes();
    
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');
    
    if (tipo === 'exito' && mensajeExito) {
        mensajeExito.textContent = texto;
        mensajeExito.style.display = 'block';
        
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 5000);
    } else if (tipo === 'error' && mensajeError) {
        mensajeError.textContent = texto;
        mensajeError.style.display = 'block';
        
        setTimeout(() => {
            mensajeError.style.display = 'none';
        }, 5000);
    }
}

function ocultarMensajes() {
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error');
    
    if (mensajeExito) mensajeExito.style.display = 'none';
    if (mensajeError) mensajeError.style.display = 'none';
}
