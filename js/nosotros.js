let desarrolladores = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarDesarrolladores();
});

async function cargarDesarrolladores() {
    try {
        const response = await fetch('../data/desarrolladores.json');
        
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        
        const data = await response.json();
        desarrolladores = data.desarrolladores;
        mostrarDesarrolladores(desarrolladores);
    } catch (error) {
        console.error('Error al cargar desarrolladores:', error);
        mostrarError();
    }
}

function mostrarDesarrolladores(lista) {
    const container = document.getElementById('desarrolladores-container');
    
    if (!container) {
        console.error('No se encontró el contenedor de desarrolladores');
        return;
    }
    
    if (lista.length === 0) {
        container.innerHTML = '<p class="error-message">No hay desarrolladores para mostrar.</p>';
        return;
    }
    
    const desarrolladoresHTML = lista.map(dev => `
        <div class="dev-card">
            <div class="dev-foto-container">
                ${crearImagenDesarrollador(dev)}
            </div>
            
            <div class="dev-info">
                <h3 class="dev-nombre">${dev.nombre}</h3>
                <p class="dev-rol">${dev.rol}</p>
                
                <div class="dev-section">
                    <h4>
                        <i class="fa-solid fa-star"></i>
                        Habilidades Claves
                    </h4>
                    <ul class="dev-lista">
                        ${dev.habilidades.map(habilidad => `
                            <li>${habilidad}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="dev-section">
                    <h4>
                        <i class="fa-solid fa-code"></i>
                        Tecnologías
                    </h4>
                    <div class="tecnologias-lista">
                        ${dev.tecnologias.map(tech => `
                            <span class="tecnologia-tag">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = desarrolladoresHTML;
}

function crearImagenDesarrollador(dev) {
    // Intentar cargar la imagen, si no existe mostrar placeholder
    return `
        <img 
            src="${dev.foto}" 
            alt="${dev.nombre}" 
            class="dev-foto"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="dev-foto-placeholder" style="display: none;">
            <i class="fa-solid fa-user"></i>
        </div>
    `;
}

function mostrarError() {
    const container = document.getElementById('desarrolladores-container');
    if (container) {
        container.innerHTML = `
            <p class="error-message">
                <i class="fa-solid fa-exclamation-triangle"></i>
                Error al cargar la información del equipo. Por favor, recarga la página.
            </p>
        `;
    }
}

// Animación de entrada para las tarjetas
function animarTarjetas() {
    const cards = document.querySelectorAll('.dev-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Ejecutar animación cuando se carguen los desarrolladores
setTimeout(animarTarjetas, 100);
