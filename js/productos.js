let productos = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
});

async function cargarProductos() {
    try {
        const response = await fetch('../data/productos.json');
        const data = await response.json();
        productos = data.productos;
        mostrarProductos(productos);
        configurarFiltro();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('productos-container').innerHTML = 
            '<p>Error al cargar productos. Recarga la página.</p>';
    }
}

function mostrarProductos(listaProductos) {
    const container = document.getElementById('productos-container');
    
    if (listaProductos.length === 0) {
        container.innerHTML = '<p>No hay productos para mostrar.</p>';
        return;
    }
    
    const productosHTML = listaProductos.map(producto => `
        <div class="producto-tarjeta">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            
            <div class="producto-contenido">
                <span class="producto-categoria">${formatearCategoria(producto.categoria)}</span>
                
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-marca">${producto.marca}</p>
                
                <p class="producto-descripcion">${producto.descripcion}</p>
                
                <div class="producto-footer">
                    <span class="producto-precio">S/ ${producto.precio.toFixed(2)}</span>
                    <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = productosHTML;
}

function configurarFiltro() {
    const select = document.getElementById('categoria-select');
    select.addEventListener('change', function() {
        filtrarProductos(this.value);
    });
}

function filtrarProductos(categoria) {
    let productosFiltrados;
    
    if (categoria === 'todos') {
        productosFiltrados = productos;
    } else {
        productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    }
    
    mostrarProductos(productosFiltrados);
}

function formatearCategoria(categoria) {
    const categorias = {
        'audio': 'Audio',
        'accesorios': 'Accesorios', 
        'gaming': 'Gaming',
        'camaras': 'Cámaras'
    };
    return categorias[categoria] || categoria;
}

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    
    if (producto) {
        mostrarMensaje(`${producto.nombre} agregado al carrito`);
        console.log('Producto agregado:', producto);
    }
}

function mostrarMensaje(texto) {
    const mensaje = document.createElement('div');
    mensaje.textContent = texto;
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
    `;
    
    document.body.appendChild(mensaje);

    setTimeout(() => {
        document.body.removeChild(mensaje);
    }, 3000);
}