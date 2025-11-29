let productos = [];
let productoSeleccionado = null;

document.addEventListener("DOMContentLoaded", function () {
  cargarProductos();
  configurarModal();
});

async function cargarProductos() {
  try {
    const response = await fetch("../data/productos.json");
    const data = await response.json();
    productos = data.productos;
    mostrarProductos(productos);
    configurarFiltro();
  } catch (error) {
    console.error("Error al cargar productos:", error);
    document.getElementById("productos-container").innerHTML = "<p>Error al cargar productos. Recarga la página.</p>";
  }
}

function mostrarProductos(listaProductos) {
  const container = document.getElementById("productos-container");

  if (listaProductos.length === 0) {
    container.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  const productosHTML = listaProductos
    .map((producto) => {
      const tieneOferta = producto.ofertaNavideña && producto.ofertaNavideña.activa;
      const precioMostrar = tieneOferta ? producto.ofertaNavideña.precioOferta : producto.precio;

      let badgeOferta = "";
      let precioHTML = "";

      if (tieneOferta) {
        badgeOferta = `
                <div class="badge-oferta-navidena">
                    <span class="badge-texto">${producto.ofertaNavideña.etiqueta}</span>
                    <span class="badge-descuento">-${producto.ofertaNavideña.descuento}%</span>
                </div>
            `;

        precioHTML = `
                <div class="precio-container">
                    <span class="producto-precio-original">S/ ${producto.precio.toFixed(2)}</span>
                    <span class="producto-precio">S/ ${precioMostrar.toFixed(2)}</span>
                </div>
            `;
      } else {
        precioHTML = `<span class="producto-precio">S/ ${precioMostrar.toFixed(2)}</span>`;
      }

      return `
            <div class="producto-tarjeta ${tieneOferta ? "con-oferta" : ""}">
                ${badgeOferta}
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                
                <div class="producto-contenido">
                    <span class="producto-categoria">${formatearCategoria(producto.categoria)}</span>
                    
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-marca">${producto.marca}</p>
                    
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    
                    <div class="producto-footer">
                        ${precioHTML}
                        <button class="btn-ver-producto" onclick="abrirModal(${producto.id})">
                            <i class="fa-solid fa-eye"></i> Ver Producto
                        </button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = productosHTML;
}

function configurarFiltro() {
  const select = document.getElementById("categoria-select");
  select.addEventListener("change", function () {
    filtrarProductos(this.value);
  });
}

function filtrarProductos(categoria) {
  let productosFiltrados;

  if (categoria === "todos") {
    productosFiltrados = productos;
  } else {
    productosFiltrados = productos.filter((producto) => producto.categoria === categoria);
  }

  mostrarProductos(productosFiltrados);
}

function formatearCategoria(categoria) {
  const categorias = {
    audio: "Audio",
    accesorios: "Accesorios",
    gaming: "Gaming",
    camaras: "Cámaras",
  };
  return categorias[categoria] || categoria;
}

// Funciones del Modal
function configurarModal() {
  const modal = document.getElementById("modal-producto");
  const overlay = document.getElementById("modal-overlay");

  // Cerrar modal al hacer click fuera
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        cerrarModal();
      }
    });
  }

  // Cerrar modal con tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      cerrarModal();
    }
  });
}

function abrirModal(productoId) {
  productoSeleccionado = productos.find((p) => p.id === productoId);

  if (!productoSeleccionado) {
    console.error("Producto no encontrado");
    return;
  }

  mostrarDetalleProducto(productoSeleccionado);

  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevenir scroll del body
  }
}

function cerrarModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // Restaurar scroll
  }
  productoSeleccionado = null;
}

function mostrarDetalleProducto(producto) {
  const modalBody = document.getElementById("modal-body");

  if (!modalBody) return;

  const stockDisponible = producto.stock > 0;
  const stockClase = stockDisponible ? "" : "sin-stock";
  const stockTexto = stockDisponible ? `${producto.stock} disponibles` : "Sin stock";
  const stockIcono = stockDisponible ? "fa-check-circle" : "fa-times-circle";

  const caracteristicasHTML = producto.caracteristicas ? producto.caracteristicas.map((car) => `<li>${car}</li>`).join("") : "<li>No hay características disponibles</li>";

  const especificacionesHTML = producto.especificaciones
    ? Object.entries(producto.especificaciones)
        .map(
          ([key, value]) => `
            <div class="especificacion-item">
                <span class="especificacion-label">${key}:</span>
                <span class="especificacion-valor">${value}</span>
            </div>
        `
        )
        .join("")
    : "<p>No hay especificaciones disponibles</p>";

  const tieneOferta = producto.ofertaNavideña && producto.ofertaNavideña.activa;
  const precioMostrar = tieneOferta ? producto.ofertaNavideña.precioOferta : producto.precio;

  let ofertaHTML = "";
  let precioModalHTML = "";

  if (tieneOferta) {
    ofertaHTML = `
            <div class="modal-oferta-navidena">
                <div class="modal-oferta-badge">
                    <i class="fa-solid fa-gift"></i>
                    <span>${producto.ofertaNavideña.etiqueta}</span>
                </div>
                <div class="modal-oferta-ahorro">
                    <span class="ahorro-texto">¡Ahorra S/ ${(producto.precio - precioMostrar).toFixed(2)}!</span>
                    <span class="ahorro-porcentaje">${producto.ofertaNavideña.descuento}% OFF</span>
                </div>
                <div class="modal-oferta-validez">
                    <i class="fa-solid fa-clock"></i>
                    <span>Válido hasta el 31 de Diciembre</span>
                </div>
            </div>
        `;

    precioModalHTML = `
            <div class="modal-precio-container">
                <div class="modal-precio-original">S/ ${producto.precio.toFixed(2)}</div>
                <div class="modal-precio">S/ ${precioMostrar.toFixed(2)}</div>
            </div>
        `;
  } else {
    precioModalHTML = `<div class="modal-precio">S/ ${precioMostrar.toFixed(2)}</div>`;
  }

  modalBody.innerHTML = `
        <div class="modal-producto-info">
            <div class="modal-imagen-container">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="modal-imagen">
            </div>
            
            <div class="modal-detalles">
                <span class="modal-categoria">${formatearCategoria(producto.categoria)}</span>
                <h2 class="modal-nombre">${producto.nombre}</h2>
                <p class="modal-marca"><i class="fa-solid fa-building"></i> ${producto.marca}</p>
                
                ${ofertaHTML}
                ${precioModalHTML}
                
                <div class="modal-stock ${stockClase}">
                    <i class="fa-solid ${stockIcono}"></i>
                    <span>${stockTexto}</span>
                </div>
                
                <div class="modal-garantia">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>Garantía: ${producto.garantia || "No especificada"}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-descripcion-detallada">
            <h3><i class="fa-solid fa-align-left"></i> Descripción</h3>
            <p>${producto.descripcionDetallada || producto.descripcion}</p>
        </div>
        
        <div class="modal-caracteristicas">
            <h3><i class="fa-solid fa-list-check"></i> Características</h3>
            <ul class="caracteristicas-lista">
                ${caracteristicasHTML}
            </ul>
        </div>
        
        <div class="modal-especificaciones">
            <h3><i class="fa-solid fa-clipboard-list"></i> Especificaciones Técnicas</h3>
            <div class="especificaciones-tabla">
                ${especificacionesHTML}
            </div>
        </div>
        
        <div class="modal-acciones">
            <button class="btn-modal-agregar" onclick="agregarAlCarrito(${producto.id})" ${!stockDisponible ? "disabled" : ""}>
                <i class="fa-solid fa-cart-plus"></i> ${stockDisponible ? "Agregar al Carrito" : "Sin Stock"}
            </button>
            <button class="btn-modal-cerrar" onclick="cerrarModal()">
                <i class="fa-solid fa-times"></i> Cerrar
            </button>
        </div>
    `;
}

// Las funciones agregarAlCarrito y mostrarMensaje ahora están en carrito.js

// Agregar estilos CSS para el botón deshabilitado
const style = document.createElement("style");
style.textContent = `
    .btn-modal-agregar:disabled {
        background: #95a5a6;
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    .btn-modal-agregar:disabled:hover {
        transform: none;
        box-shadow: none;
    }
`;
document.head.appendChild(style);
