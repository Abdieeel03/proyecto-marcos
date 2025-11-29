// Sistema de Carrito de Compras

// Inicializar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Actualizar contador del carrito al cargar
document.addEventListener("DOMContentLoaded", function () {
  actualizarContadorCarrito();

  // Si estamos en la página del carrito, mostrar los productos
  const carritoContainer = document.getElementById("carrito-productos");
  if (carritoContainer) {
    mostrarCarrito();
  }
});

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
  const producto = productos.find((p) => p.id === productoId);

  if (!producto || producto.stock <= 0) {
    mostrarNotificacion("Producto no disponible", "error");
    return;
  }

  // Verificar si el producto ya está en el carrito
  const itemExistente = carrito.find((item) => item.id === productoId);

  if (itemExistente) {
    // Verificar stock disponible
    if (itemExistente.cantidad >= producto.stock) {
      mostrarNotificacion("No hay más stock disponible", "error");
      return;
    }
    itemExistente.cantidad++;
  } else {
    // Determinar precio (con oferta o sin oferta)
    const tieneOferta = producto.ofertaNavideña && producto.ofertaNavideña.activa;
    const precioFinal = tieneOferta ? producto.ofertaNavideña.precioOferta : producto.precio;

    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: precioFinal,
      precioOriginal: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
      stock: producto.stock,
      tieneOferta: tieneOferta,
      descuento: tieneOferta ? producto.ofertaNavideña.descuento : 0,
    });
  }

  guardarCarrito();
  actualizarContadorCarrito();
  mostrarNotificacion(`${producto.nombre} agregado al carrito`, "exito");

  // Si estamos en el modal, cerrarlo después de un momento
  if (document.getElementById("modal-overlay").classList.contains("active")) {
    setTimeout(() => {
      cerrarModal();
    }, 1500);
  }
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
  const contador = document.getElementById("carrito-contador");
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  if (contador) {
    contador.textContent = totalItems;
    contador.style.display = totalItems > 0 ? "flex" : "none";
  }
}

// Abrir modal del carrito
function abrirCarrito() {
  const modal = document.getElementById("modal-carrito");
  if (modal) {
    mostrarCarrito();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// Cerrar modal del carrito
function cerrarCarrito() {
  const modal = document.getElementById("modal-carrito");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Mostrar productos del carrito
function mostrarCarrito() {
  const container = document.getElementById("carrito-productos");
  const resumen = document.getElementById("carrito-resumen");

  if (!container) return;

  if (carrito.length === 0) {
    container.innerHTML = `
            <div class="carrito-vacio">
                <i class="fa-solid fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para comenzar tu compra</p>
                <a href="./productos.html" class="btn-ver-productos">Ver Productos</a>
            </div>
        `;

    if (resumen) {
      resumen.innerHTML = "";
    }
    return;
  }

  // Mostrar productos
  const productosHTML = carrito
    .map(
      (item) => `
        <div class="carrito-item">
            <div class="carrito-item-imagen">
                <img src="${item.imagen}" alt="${item.nombre}">
                ${item.tieneOferta ? `<span class="item-badge-oferta">-${item.descuento}%</span>` : ""}
            </div>
            <div class="carrito-item-info">
                <h4>${item.nombre}</h4>
                <div class="carrito-item-precio">
                    ${item.tieneOferta ? `<span class="precio-original">S/ ${item.precioOriginal.toFixed(2)}</span>` : ""}
                    <span class="precio-actual">S/ ${item.precio.toFixed(2)}</span>
                </div>
            </div>
            <div class="carrito-item-cantidad">
                <button onclick="cambiarCantidad(${item.id}, -1)" class="btn-cantidad">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <span class="cantidad">${item.cantidad}</span>
                <button onclick="cambiarCantidad(${item.id}, 1)" class="btn-cantidad" ${item.cantidad >= item.stock ? "disabled" : ""}>
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <div class="carrito-item-subtotal">
                <span>S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
            <button onclick="eliminarDelCarrito(${item.id})" class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `
    )
    .join("");

  container.innerHTML = productosHTML;

  // Mostrar resumen
  if (resumen) {
    actualizarResumen();
  }
}

// Cambiar cantidad de un producto
function cambiarCantidad(productoId, cambio) {
  const item = carrito.find((i) => i.id === productoId);

  if (!item) return;

  const nuevaCantidad = item.cantidad + cambio;

  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(productoId);
    return;
  }

  if (nuevaCantidad > item.stock) {
    mostrarNotificacion("No hay más stock disponible", "error");
    return;
  }

  item.cantidad = nuevaCantidad;
  guardarCarrito();
  mostrarCarrito();
  actualizarContadorCarrito();
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId) {
  carrito = carrito.filter((item) => item.id !== productoId);
  guardarCarrito();
  mostrarCarrito();
  actualizarContadorCarrito();
  mostrarNotificacion("Producto eliminado del carrito", "exito");
}

// Vaciar todo el carrito
function vaciarCarrito() {
  if (carrito.length === 0) return;

  if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion("Carrito vaciado", "exito");
  }
}

// Actualizar resumen del carrito
function actualizarResumen() {
  const resumen = document.getElementById("carrito-resumen");
  if (!resumen) return;

  const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const descuentoTotal = carrito.reduce((sum, item) => {
    if (item.tieneOferta) {
      return sum + (item.precioOriginal - item.precio) * item.cantidad;
    }
    return sum;
  }, 0);
  const envio = subtotal > 100 ? 0 : 10;
  const total = subtotal + envio;

  resumen.innerHTML = `
        <h3>Resumen del Pedido</h3>
        <div class="resumen-linea">
            <span>Subtotal:</span>
            <span>S/ ${subtotal.toFixed(2)}</span>
        </div>
        ${
          descuentoTotal > 0
            ? `
            <div class="resumen-linea descuento">
                <span>Descuentos:</span>
                <span>-S/ ${descuentoTotal.toFixed(2)}</span>
            </div>
        `
            : ""
        }
        <div class="resumen-linea">
            <span>Envío:</span>
            <span>${envio === 0 ? "GRATIS" : "S/ " + envio.toFixed(2)}</span>
        </div>
        ${subtotal > 100 ? '<p class="envio-gratis"><i class="fa-solid fa-truck"></i> ¡Envío gratis en compras mayores a S/ 100!</p>' : ""}
        <div class="resumen-total">
            <span>Total:</span>
            <span>S/ ${total.toFixed(2)}</span>
        </div>
        <button onclick="procederAlPago()" class="btn-finalizar">
            <i class="fa-solid fa-credit-card"></i> Finalizar Compra
        </button>
        <button onclick="vaciarCarrito()" class="btn-vaciar">
            <i class="fa-solid fa-trash"></i> Vaciar Carrito
        </button>
    `;
}

// Proceder al pago
function procederAlPago() {
  // Verificar si el usuario está logueado
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

  if (!usuarioActual) {
    cerrarCarrito();
    mostrarNotificacion("Debes iniciar sesión para continuar con la compra", "error");
    setTimeout(() => {
      abrirModalLogin();
    }, 500);
    return;
  }

  if (carrito.length === 0) {
    mostrarNotificacion("El carrito está vacío", "error");
    return;
  }

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const envio = subtotal > 100 ? 0 : 10;
  const total = subtotal + envio;

  // Crear compra
  const compra = {
    id: Date.now(),
    emailUsuario: usuarioActual.email,
    fecha: new Date().toISOString(),
    total: total,
    estado: "procesando",
    productos: carrito.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
      imagen: item.imagen,
    })),
  };

  // Guardar compra
  const compras = JSON.parse(localStorage.getItem("compras") || "[]");
  compras.push(compra);
  localStorage.setItem("compras", JSON.stringify(compras));

  // Vaciar carrito
  carrito = [];
  guardarCarrito();
  actualizarContadorCarrito();

  // Cerrar modal
  cerrarCarrito();

  // Mostrar confirmación
  mostrarNotificacion("¡Compra realizada con éxito! Puedes ver tu pedido en tu perfil.", "exito");

  // Mostrar modal de confirmación
  setTimeout(() => {
    mostrarModalConfirmacion(compra);
  }, 500);
}

// Mostrar modal de confirmación de compra
function mostrarModalConfirmacion(compra) {
  const modal = document.createElement("div");
  modal.className = "modal-auth active";
  modal.innerHTML = `
        <div class="modal-auth-content" style="max-width: 500px;">
            <div class="modal-auth-header" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">
                <h2><i class="fa-solid fa-check-circle"></i> ¡Compra Exitosa!</h2>
                <p>Tu pedido ha sido procesado correctamente</p>
            </div>
            <div class="modal-auth-body" style="text-align: center;">
                <div style="margin: 2rem 0;">
                    <div style="font-size: 4rem; color: #27ae60; margin-bottom: 1rem;">
                        <i class="fa-solid fa-box-open"></i>
                    </div>
                    <h3 style="color: #333; margin-bottom: 1rem;">Pedido #${compra.id}</h3>
                    <p style="color: #666; margin-bottom: 1.5rem;">
                        Recibirás un correo de confirmación pronto.<br>
                        Puedes revisar el estado de tu pedido en tu perfil.
                    </p>
                    <div style="background: #f5f5f5; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                        <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Total Pagado</div>
                        <div style="font-size: 2rem; color: #27ae60; font-weight: 700;">S/ ${compra.total.toFixed(2)}</div>
                    </div>
                </div>
                <button onclick="this.closest('.modal-auth').remove(); document.body.style.overflow = '';" class="btn-submit">
                    <i class="fa-solid fa-check"></i> Entendido
                </button>
            </div>
        </div>
    `;

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.remove();
      document.body.style.overflow = "";
    }
  });

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
}
